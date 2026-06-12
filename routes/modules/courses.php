<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseReviewController;
use App\Http\Controllers\LessonController;
use Illuminate\Support\Facades\Route;

Route::resource('courses', CourseController::class);

// Lesson management (nested under modules)
Route::post('modules/{module}/lessons', [LessonController::class, 'store'])->name('modules.lessons.store');
Route::put('lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
Route::delete('lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');

// Course reviews
Route::post('courses/{course}/reviews', [CourseReviewController::class, 'store'])->name('courses.reviews.store');
Route::delete('courses/{course}/reviews', [CourseReviewController::class, 'destroy'])->name('courses.reviews.destroy');
