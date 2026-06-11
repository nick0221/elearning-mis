<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\DiscussionController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

// Announcements
Route::get('announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
Route::post('announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
Route::delete('announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

// Discussions
Route::resource('discussions', DiscussionController::class);
Route::post('discussions/{discussion}/reply', [DiscussionController::class, 'reply'])->name('discussions.reply');

// Messages
Route::resource('messages', MessageController::class)->only(['index', 'create', 'store', 'show', 'destroy']);
