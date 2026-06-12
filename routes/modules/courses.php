<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseReviewController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\ModuleController;
use Illuminate\Support\Facades\Route;

Route::resource('courses', CourseController::class);

// Module management (nested under courses)
Route::post('courses/{course}/modules', [ModuleController::class, 'store'])->name('courses.modules.store');
Route::put('modules/{module}', [ModuleController::class, 'update'])->name('modules.update');
Route::delete('modules/{module}', [ModuleController::class, 'destroy'])->name('modules.destroy');
Route::put('courses/{course}/modules/reorder', [ModuleController::class, 'reorder'])->name('courses.modules.reorder');

// Lesson management (nested under modules)
Route::post('modules/{module}/lessons', [LessonController::class, 'store'])->name('modules.lessons.store');
Route::put('lessons/{lesson}', [LessonController::class, 'update'])->name('lessons.update');
Route::delete('lessons/{lesson}', [LessonController::class, 'destroy'])->name('lessons.destroy');
Route::put('modules/{module}/lessons/reorder', [LessonController::class, 'reorder'])->name('modules.lessons.reorder');

// Course reviews
Route::post('courses/{course}/reviews', [CourseReviewController::class, 'store'])->name('courses.reviews.store');
Route::delete('courses/{course}/reviews', [CourseReviewController::class, 'destroy'])->name('courses.reviews.destroy');
