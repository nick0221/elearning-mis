<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create/edit own courses');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:5000',
            'category_id' => 'nullable|exists:categories,id',
            'difficulty' => 'required|in:beginner,intermediate,advanced',
            'max_students' => 'nullable|integer|min:1',
            'estimated_duration_minutes' => 'nullable|integer|min:1',
            'thumbnail' => 'nullable|image|max:2048',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Please enter a course title.',
            'title.max' => 'Course title must not exceed 255 characters.',
            'difficulty.required' => 'Please select a difficulty level.',
            'difficulty.in' => 'Invalid difficulty level.',
            'category_id.exists' => 'The selected category is invalid.',
            'thumbnail.image' => 'Please upload a valid image file.',
            'thumbnail.max' => 'Thumbnail must not exceed 2MB.',
        ];
    }
}
