<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $inbox = Message::where('receiver_id', $user->id)
            ->with('sender')
            ->latest()
            ->paginate(15);

        $unreadCount = Message::where('receiver_id', $user->id)->whereNull('read_at')->count();

        return Inertia::render('Messages/Index', [
            'inbox' => $inbox,
            'unreadCount' => $unreadCount,
        ]);
    }

    public function create(Request $request)
    {
        $users = User::where('id', '!=', $request->user()->id)
            ->orderBy('name')
            ->get();

        return Inertia::render('Messages/Create', [
            'users' => $users,
            'recipientId' => $request->input('recipient_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string|max:5000',
        ]);

        $validated['sender_id'] = $request->user()->id;

        Message::create($validated);

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'message_sent',
            'subject_type' => Message::class,
            'subject_id' => null,
            'properties' => ['receiver_id' => $validated['receiver_id'], 'subject' => $validated['subject']],
        ]);

        return redirect()->route('messages.index')
            ->with('success', 'Message sent.');
    }

    public function show(Message $message)
    {
        $message->load(['sender', 'receiver']);

        if ($message->receiver_id === request()->user()->id && ! $message->read_at) {
            $message->update(['read_at' => now()]);
        }

        return Inertia::render('Messages/Show', [
            'message' => $message,
        ]);
    }

    public function destroy(Message $message)
    {
        $message->delete();

        return back()->with('success', 'Message deleted.');
    }
}
