<?php

namespace App\Services;

use OpenAI;

class OpenAIService
{
    protected $client;

    public function __construct()
    {
        // Khởi tạo OpenAI Client bằng cách gọi phương thức OpenAI::client()
        $this->client = OpenAI::client('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');
    }

    public function filterReview($reviewContent)
    {
        $response = $this->client->completions()->create([
            'model' => 'gpt-3.5-turbo',
            'prompt' => "Return the review if it does not contain inappropriate content, otherwise return 'This review contains inappropriate content'. Review: " . $reviewContent,
            'max_tokens' => 100,
        ]);

        return trim($response['choices'][0]['text']);
    }
}
