<?php

use App\Http\Controllers\AssessmentController;
use Illuminate\Support\Facades\Route;

Route::resource('assessments', AssessmentController::class);
Route::post('assessments/{assessment}/add-question', [AssessmentController::class, 'addQuestion'])->name('assessments.add-question');
Route::get('assessments/{assessment}/take', [AssessmentController::class, 'take'])->name('assessments.take');
Route::post('assessments/{assessment}/submit', [AssessmentController::class, 'submit'])->name('assessments.submit');
