<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAssessmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create/edit/delete assessments');
    }

    public function rules(): array
    {
        return [
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'type' => 'required|in:quiz,assignment',
            'max_attempts' => 'required|integer|min:1',
            'time_limit_minutes' => 'nullable|integer|min:1',
            'passing_score' => 'required|integer|min:0|max:100',
            'is_randomized' => 'boolean',
        ];
    }
}
