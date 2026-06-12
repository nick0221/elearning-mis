<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->keyBy('key');

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'required|string',
            'settings.*.type' => 'required|string',
        ]);

        $changedKeys = [];

        foreach ($validated['settings'] as $item) {
            $oldValue = Setting::get($item['key']);
            if ($oldValue !== $item['value']) {
                $changedKeys[] = $item['key'];
            }
            Setting::set($item['key'], $item['value'], $item['group'], $item['type']);
        }

        if (! empty($changedKeys)) {
            ActivityLog::create([
                'user_id' => $this->userId(),
                'action' => 'settings_updated',
                'subject_type' => Setting::class,
                'subject_id' => null,
                'properties' => ['changed_keys' => $changedKeys],
            ]);
        }

        return back()->with('success', 'Settings updated.');
    }
}
