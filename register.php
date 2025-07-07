

<?php
session_start();


// Function to generate arithmetic CAPTCHA
function generateArithmeticCaptcha() {
    $operations = ['+', '-', '*'];
    $operation = $operations[array_rand($operations)];
    
    switch ($operation) {
        case '+':
            $num1 = rand(1, 20);
            $num2 = rand(1, 20);
            $answer = $num1 + $num2;
            $question = "$num1 + $num2 = ?";
            break;
        case '-':
            $num1 = rand(10, 30);
            $num2 = rand(1, 10);
            $answer = $num1 - $num2;
            $question = "$num1 - $num2 = ?";
            break;
        case '*':
            $num1 = rand(1, 10);
            $num2 = rand(1, 10);
            $answer = $num1 * $num2;
            $question = "$num1 × $num2 = ?";
            break;
    }
    
    return [
        'question' => $question,
        'answer' => (string)$answer
    ];
}

// Handle AJAX request for new CAPTCHA
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['get_captcha'])) {
    header('Content-Type: application/json');
    echo json_encode(generateArithmeticCaptcha());
    exit;
}

// Check if this is a username availability check
if (isset($_GET['check_username'])) {
    $username = $_GET['username'] ?? '';
    $users = [];
    
    // Read existing users from JSON file
    if (file_exists('users.json')) {
        $users = json_decode(file_get_contents('users.json'), true) ?? [];
    }
    
    // Check if username exists
    $exists = false;
    foreach ($users as $user) {
        if ($user['username'] === $username) {
            $exists = true;
            break;
        }
    }
    
    echo json_encode(['exists' => $exists]);
    exit;
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $password = $_POST['password'] ?? '';
    $confirmPassword = $_POST['confirmPassword'] ?? '';
    $captcha = $_POST['captcha'] ?? '';
    $storedCaptcha = $_POST['stored_captcha'] ?? '';

    $errors = [];

    // Validate all fields are filled
    if (empty($username) || empty($password) || empty($confirmPassword) || empty($captcha)) {
        $errors[] = "All fields are required";
    }

    // Validate username
    if (strlen($username) < 3 || strlen($username) > 20) {
        $errors[] = "Username must be between 3 and 20 characters";
    }

    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $username)) {
        $errors[] = "Username can only contain letters, numbers, underscores, and hyphens";
    }

    // Validate password match
    if ($password !== $confirmPassword) {
        $errors[] = "Passwords do not match";
    }

    // Validate password (NIST-compliant)
    if (strlen($password) < 8) {
        $errors[] = "Password must be at least 8 characters long.";
    }
    if (strlen($password) > 64) {
        $errors[] = "Password must not exceed 64 characters.";
    }

    // Validate CAPTCHA
    if (empty($storedCaptcha) || $captcha !== $storedCaptcha) {
        $errors[] = "Invalid CAPTCHA";
    }

    // Check for existing username
    $users = [];
    if (file_exists('users.json')) {
        $users = json_decode(file_get_contents('users.json'), true) ?? [];
        foreach ($users as $user) {
            if ($user['username'] === $username) {
                $errors[] = "Username already exists";
                break;
            }
        }
    }

    // If no errors, proceed with registration
    if (empty($errors)) {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        // Store user data
        $users[$username] = [
            'username' => $username,
            'password' => $hashedPassword,
            'registered_at' => date('Y-m-d H:i:s')
        ];
        // Save to JSON file
        file_put_contents('users.json', json_encode($users, JSON_PRETTY_PRINT));
        $success = true;
    }
}

// Generate new CAPTCHA for the form
$captcha = generateArithmeticCaptcha();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Result</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <?php if (isset($success)): ?>
            <h1>Registration Successful!</h1>
            <p>Welcome, <?php echo htmlspecialchars($username); ?>!</p>
            <p>Your account has been created successfully.</p>
            <a href="index.html" class="button">Back to Login</a>
        <?php else: ?>
            <h1>Registration Failed</h1>
            <?php if (!empty($errors)): ?>
                <div class="error-message">
                    <?php foreach ($errors as $error): ?>
                        <p><?php echo htmlspecialchars($error); ?></p>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
            <a href="index.html" class="button">Try Again</a>
        <?php endif; ?>
    </div>
</body>
</html> 