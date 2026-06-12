<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Assessment;
use App\Models\Category;
use App\Models\Course;
use App\Models\CourseModule;
use App\Models\Discussion;
use App\Models\DiscussionReply;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Message;
use App\Models\Question;
use App\Models\QuestionOption;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $categories = [
            ['name' => 'Web Development', 'slug' => 'web-development', 'description' => 'HTML, CSS, JavaScript, React, and more'],
            ['name' => 'Data Science', 'slug' => 'data-science', 'description' => 'Python, Machine Learning, Statistics'],
            ['name' => 'Mobile Development', 'slug' => 'mobile-development', 'description' => 'iOS, Android, React Native, Flutter'],
            ['name' => 'DevOps', 'slug' => 'devops', 'description' => 'Docker, Kubernetes, CI/CD, Cloud'],
            ['name' => 'Database', 'slug' => 'database', 'description' => 'SQL, NoSQL, Database Design'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        // Demo Users
        $instructors = [
            User::factory()->create(['name' => 'Dr. Sarah Chen', 'email' => 'sarah@elearning.com']),
            User::factory()->create(['name' => 'Prof. Michael Rodriguez', 'email' => 'michael@elearning.com']),
            User::factory()->create(['name' => 'Emily Watson', 'email' => 'emily@elearning.com']),
        ];
        foreach ($instructors as $i) {
            $i->assignRole('instructor');
        }

        $students = [];
        for ($i = 1; $i <= 10; $i++) {
            $student = User::factory()->create(['name' => "Student {$i}"]);
            $student->assignRole('student');
            $students[] = $student;
        }

        // Demo Courses
        $coursesData = [
            [
                'title' => 'Complete Web Development Bootcamp',
                'description' => 'Master HTML, CSS, JavaScript, React, Node.js, and more. Build real-world projects from scratch.',
                'category' => 'web-development',
                'difficulty' => 'beginner',
                'status' => 'published',
                'instructor' => 0,
                'modules' => [
                    ['title' => 'Getting Started with HTML', 'lessons' => [
                        ['title' => 'What is HTML?', 'type' => 'video', 'video_url' => 'https://www.youtube.com/embed/UB1O30fR-EE', 'content' => 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using a series of elements that tell the browser how to display content.', 'duration_minutes' => 10],
                        ['title' => 'HTML Document Structure', 'type' => 'text', 'content' => "HTML Document Structure\n\nEvery HTML document starts with a doctype declaration, followed by the html, head, and body elements.\n\nThe head contains metadata like the page title, character set, and linked stylesheets.\n\nThe body contains the visible content of the page.\n\nHere's a basic HTML template:\n\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>My First Page</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>This is my first HTML page.</p>\n</body>\n</html>", 'duration_minutes' => 8],
                        ['title' => 'HTML Elements & Tags', 'type' => 'text', 'content' => "HTML Elements & Tags\n\nHTML elements are defined by start tags, content, and end tags.\n\nCommon HTML Elements:\n• <h1> to <h6> - Headings\n• <p> - Paragraphs\n• <a> - Links\n• <img> - Images\n• <ul>, <ol>, <li> - Lists\n• <div> - Division/Container\n• <span> - Inline container\n\nSelf-closing tags:\n• <br> - Line break\n• <img> - Image\n• <input> - Input field", 'duration_minutes' => 12],
                    ]],
                    ['title' => 'CSS Fundamentals', 'lessons' => [
                        ['title' => 'Introduction to CSS', 'type' => 'video', 'video_url' => 'https://www.youtube.com/embed/1PnVorN6Ck0', 'content' => 'CSS (Cascading Style Sheets) controls the visual presentation of HTML elements. It separates content from design, making it easier to maintain and update styles across your website.', 'duration_minutes' => 15],
                        ['title' => 'CSS Selectors', 'type' => 'text', 'content' => "CSS Selectors\n\nCSS selectors define which HTML elements a set of CSS rules apply to.\n\nTypes of selectors:\n• Element selector: p { color: red; }\n• Class selector: .className { color: blue; }\n• ID selector: #idName { color: green; }\n• Attribute selector: [type='text'] { color: purple; }\n\nCombinators:\n• Descendant: div p\n• Child: div > p\n• Sibling: div + p\n• General sibling: div ~ p", 'duration_minutes' => 10],
                    ]],
                    ['title' => 'JavaScript Basics', 'lessons' => [
                        ['title' => 'Variables and Data Types', 'type' => 'video', 'video_url' => 'https://www.youtube.com/embed/W6NZfrv5x1M', 'content' => 'JavaScript has three ways to declare variables: var, let, and const. Data types include strings, numbers, booleans, null, undefined, objects, and arrays.', 'duration_minutes' => 12],
                        ['title' => 'Functions and Scope', 'type' => 'text', 'content' => "Functions in JavaScript\n\nFunctions are reusable blocks of code.\n\nFunction Declaration:\nfunction greet(name) {\n    return 'Hello, ' + name;\n}\n\nFunction Expression:\nconst greet = function(name) {\n    return 'Hello, ' + name;\n}\n\nArrow Function:\nconst greet = (name) => 'Hello, ' + name;\n\nScope:\n• Global scope - accessible everywhere\n• Function scope - accessible within function\n• Block scope - accessible within {} with let/const", 'duration_minutes' => 10],
                    ]],
                ],
            ],
            [
                'title' => 'Python for Data Science',
                'description' => 'Learn Python programming for data analysis, visualization, and machine learning. Perfect for beginners.',
                'category' => 'data-science',
                'difficulty' => 'beginner',
                'status' => 'published',
                'instructor' => 1,
                'modules' => [
                    ['title' => 'Python Fundamentals', 'lessons' => [
                        ['title' => 'Setting Up Python', 'type' => 'text', 'content' => 'Python is a versatile programming language used in web development, data science, AI, and automation. Install Python from python.org and set up your development environment.'],
                        ['title' => 'Data Types and Variables', 'type' => 'text', 'content' => 'Python has dynamic typing with built-in types: int, float, str, bool, list, tuple, dict, and set. Variables are created by assignment.'],
                    ]],
                    ['title' => 'Data Analysis with Pandas', 'lessons' => [
                        ['title' => 'Introduction to Pandas', 'type' => 'text', 'content' => 'Pandas is the primary data manipulation library in Python. It provides DataFrames for tabular data and Series for one-dimensional data.'],
                        ['title' => 'Data Cleaning', 'type' => 'text', 'content' => 'Data cleaning involves handling missing values, removing duplicates, fixing inconsistencies, and transforming data into the right format for analysis.'],
                    ]],
                ],
            ],
            [
                'title' => 'React Native Mobile Development',
                'description' => 'Build cross-platform mobile apps with React Native. Deploy to iOS and Android from a single codebase.',
                'category' => 'mobile-development',
                'difficulty' => 'intermediate',
                'status' => 'published',
                'instructor' => 2,
                'modules' => [
                    ['title' => 'React Native Fundamentals', 'lessons' => [
                        ['title' => 'What is React Native?', 'type' => 'text', 'content' => 'React Native allows you to build mobile apps using React and JavaScript. It renders native components, providing near-native performance.'],
                        ['title' => 'Setting Up Your Environment', 'type' => 'text', 'content' => 'Install Node.js, Watchman, and either Xcode (iOS) or Android Studio (Android). Use Expo for easier setup.'],
                    ]],
                    ['title' => 'Building Your First App', 'lessons' => [
                        ['title' => 'Creating a New Project', 'type' => 'text', 'content' => 'Use npx create-expo-app to scaffold a new React Native project with Expo. This sets up the project structure and dependencies.'],
                    ]],
                ],
            ],
        ];

        foreach ($coursesData as $courseData) {
            $course = Course::create([
                'title' => $courseData['title'],
                'slug' => Str::slug($courseData['title']),
                'description' => $courseData['description'],
                'difficulty' => $courseData['difficulty'],
                'status' => $courseData['status'],
                'category_id' => Category::where('slug', $courseData['category'])->first()->id,
                'estimated_duration_minutes' => rand(120, 360),
            ]);

            $course->instructors()->attach($instructors[$courseData['instructor']]->id, ['is_primary' => true]);

            foreach ($courseData['modules'] as $modIndex => $modData) {
                $module = CourseModule::create([
                    'course_id' => $course->id,
                    'title' => $modData['title'],
                    'sort_order' => $modIndex,
                ]);

                foreach ($modData['lessons'] as $lessonIndex => $lessonData) {
                    Lesson::create([
                        'module_id' => $module->id,
                        'title' => $lessonData['title'],
                        'content' => $lessonData['content'],
                        'type' => $lessonData['type'],
                        'sort_order' => $lessonIndex,
                        'duration_minutes' => rand(5, 20),
                    ]);
                }
            }

            // Enroll some students
            $enrolledStudents = array_slice($students, 0, rand(3, 8));
            foreach ($enrolledStudents as $student) {
                Enrollment::create([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'status' => rand(1, 10) > 3 ? 'enrolled' : 'completed',
                    'enrolled_at' => now()->subDays(rand(1, 30)),
                ]);
            }

            // Create assessment for first course
            if ($course->id === 1) {
                $assessment = Assessment::create([
                    'course_id' => $course->id,
                    'title' => 'Web Development Fundamentals Quiz',
                    'type' => 'quiz',
                    'max_attempts' => 3,
                    'time_limit_minutes' => 30,
                    'passing_score' => 60,
                ]);

                $questions = [
                    ['body' => 'What does HTML stand for?', 'type' => 'mcq', 'options' => [
                        ['body' => 'HyperText Markup Language', 'is_correct' => true],
                        ['body' => 'High Tech Modern Language', 'is_correct' => false],
                        ['body' => 'Home Tool Markup Language', 'is_correct' => false],
                    ]],
                    ['body' => 'CSS is used for styling web pages.', 'type' => 'true_false', 'options' => [
                        ['body' => 'True', 'is_correct' => true],
                        ['body' => 'False', 'is_correct' => false],
                    ]],
                    ['body' => 'Which keyword declares a constant in JavaScript?', 'type' => 'mcq', 'options' => [
                        ['body' => 'var', 'is_correct' => false],
                        ['body' => 'let', 'is_correct' => false],
                        ['body' => 'const', 'is_correct' => true],
                    ]],
                ];

                foreach ($questions as $qIndex => $qData) {
                    $question = Question::create([
                        'assessment_id' => $assessment->id,
                        'body' => $qData['body'],
                        'type' => $qData['type'],
                        'points' => 1,
                        'sort_order' => $qIndex,
                    ]);

                    foreach ($qData['options'] as $oIndex => $optData) {
                        QuestionOption::create([
                            'question_id' => $question->id,
                            'body' => $optData['body'],
                            'is_correct' => $optData['is_correct'],
                            'sort_order' => $oIndex,
                        ]);
                    }
                }
            }
        }

        // Demo Announcements
        Announcement::create([
            'user_id' => $instructors[0]->id,
            'title' => 'Welcome to the New Semester!',
            'body' => 'We are excited to announce the start of our new courses. Check out the available courses and enroll today!',
            'is_pinned' => true,
            'published_at' => now()->subDays(5),
        ]);

        // Demo Discussions
        $discussion = Discussion::create([
            'course_id' => 1,
            'user_id' => $students[0]->id,
            'title' => 'Best resources for learning React?',
            'body' => 'I want to learn React after completing this web development course. Any recommendations for resources?',
        ]);

        DiscussionReply::create([
            'discussion_id' => $discussion->id,
            'user_id' => $instructors[0]->id,
            'body' => 'Great question! I recommend the official React documentation and building small projects. Practice is key!',
        ]);

        // Demo Messages
        Message::create([
            'sender_id' => $instructors[0]->id,
            'receiver_id' => $students[0]->id,
            'subject' => 'Welcome to the course!',
            'body' => 'Hi! Welcome to the Web Development Bootcamp. Feel free to ask any questions.',
            'read_at' => now()->subHours(2),
        ]);

        $this->command->info('Demo data seeded successfully!');
    }
}
