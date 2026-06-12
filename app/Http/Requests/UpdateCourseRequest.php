<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        $course = $this->route('course');

        return $this->user()->can('update', $course);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'prerequisites' => 'nullable|string|max:2000',
            'learning_outcomes' => 'nullable|string|max:5000',
            'target_audience' => 'nullable|string|max:500',
            'category_id' => 'nullable|exists:categories,id',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'status' => 'required|in:draft,published,archived',
            'max_students' => 'nullable|integer|min:1',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a course title.',
            'difficulty.required' => 'Please select a difficulty level.',
            'status.required' => 'Please select a course status.',
            'category_id.exists' => 'The selected category is invalid.',
            'thumbnail.image' => 'Please upload a valid image file.',
            'thumbnail.max' => 'Thumbnail must not exceed 2MB.',
        ];
    }
}
