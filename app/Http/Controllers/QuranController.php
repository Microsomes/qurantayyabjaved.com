<?php

namespace App\Http\Controllers;

use App\Models\QuranPageCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class QuranController extends Controller
{
    public function page(int $n): JsonResponse
    {
        if ($n < 1 || $n > 604) {
            return response()->json(['message' => 'Page must be between 1 and 604'], 422);
        }

        $cached = QuranPageCache::find($n);

        if ($cached) {
            return response()->json($cached->data);
        }

        $data = $this->fetchFromApi($n);

        if (! $data) {
            return response()->json(['message' => 'Failed to fetch Quran data'], 503);
        }

        QuranPageCache::create([
            'page_number' => $n,
            'data' => $data,
            'cached_at' => now(),
        ]);

        return response()->json($data);
    }

    public function prefetch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'pages' => 'required|array|max:5',
            'pages.*' => 'integer|min:1|max:604',
        ]);

        $cached = QuranPageCache::whereIn('page_number', $validated['pages'])
            ->pluck('page_number')
            ->toArray();

        $missing = array_diff($validated['pages'], $cached);

        foreach ($missing as $pageNum) {
            $data = $this->fetchFromApi($pageNum);
            if ($data) {
                QuranPageCache::create([
                    'page_number' => $pageNum,
                    'data' => $data,
                    'cached_at' => now(),
                ]);
            }
        }

        return response()->json(['cached' => count($validated['pages'])]);
    }

    private function fetchFromApi(int $page): ?array
    {
        try {
            $response = Http::timeout(15)
                ->get("https://api.quran.com/api/v4/verses/by_page/{$page}", [
                    'words' => 'true',
                    'word_fields' => 'audio_url,text_uthmani',
                ]);

            if (! $response->successful()) {
                return null;
            }

            $body = $response->json();
            $verses = $body['verses'] ?? [];

            if (empty($verses)) {
                return null;
            }

            $surahs = [];
            $ayahs = [];

            foreach ($verses as $verse) {
                $verseKey = $verse['verse_key'];
                [$surahNum, $ayahNum] = explode(':', $verseKey);
                $surahNum = (int) $surahNum;
                $ayahNum = (int) $ayahNum;

                if (! isset($surahs[$surahNum])) {
                    $surahs[$surahNum] = $this->fetchSurahInfo($surahNum);
                }

                $words = [];
                foreach ($verse['words'] ?? [] as $word) {
                    $words[] = [
                        'text' => $word['text_uthmani'] ?? $word['text'],
                        'audio_url' => $word['audio_url']
                            ? 'https://audio.qurancdn.com/'.$word['audio_url']
                            : null,
                        'char_type' => $word['char_type_name'],
                        'position' => $word['position'],
                    ];
                }

                $ayahs[] = [
                    'number' => $verse['id'],
                    'text' => collect($words)
                        ->where('char_type', 'word')
                        ->pluck('text')
                        ->implode(' '),
                    'numberInSurah' => $ayahNum,
                    'juz' => $verse['juz_number'],
                    'page' => $verse['page_number'],
                    'surahNumber' => $surahNum,
                    'words' => $words,
                ];
            }

            return [
                'page' => $page,
                'surahs' => array_values($surahs),
                'ayahs' => $ayahs,
                'juz' => $ayahs[0]['juz'] ?? null,
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

    private function fetchSurahInfo(int $surahNumber): array
    {
        static $cache = [];

        if (isset($cache[$surahNumber])) {
            return $cache[$surahNumber];
        }

        try {
            $response = Http::timeout(10)
                ->get("https://api.quran.com/api/v4/chapters/{$surahNumber}");

            if ($response->successful()) {
                $ch = $response->json()['chapter'] ?? [];
                $cache[$surahNumber] = [
                    'number' => $surahNumber,
                    'name' => $ch['name_arabic'] ?? '',
                    'englishName' => $ch['name_simple'] ?? '',
                    'englishNameTranslation' => $ch['translated_name']['name'] ?? '',
                    'numberOfAyahs' => $ch['verses_count'] ?? 0,
                    'revelationType' => $ch['revelation_place'] ?? '',
                ];

                return $cache[$surahNumber];
            }
        } catch (\Exception $e) {
            // fall through
        }

        $cache[$surahNumber] = [
            'number' => $surahNumber,
            'name' => '',
            'englishName' => "Surah {$surahNumber}",
            'englishNameTranslation' => '',
            'numberOfAyahs' => 0,
            'revelationType' => '',
        ];

        return $cache[$surahNumber];
    }
}
