# User Registration System

A modern, secure user registration system built with HTML, CSS, JavaScript, and PHP, featuring NIST-compliant password validation and real-time username availability checking.

## 🌟 Features

### Security Features
- **NIST-Compliant Password Validation**: Follows NIST SP 800-63B guidelines
  - Minimum 8 characters required
  - Maximum 64 characters allowed
  - Accepts all printable characters (including spaces and Unicode)
  - No enforced composition rules (no forced uppercase, numbers, symbols)
  - Password strength meter with visual feedback
  - "Show Password" toggle for user convenience

### User Experience
- **Real-time Username Availability**: Live checking as you type
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Interactive Feedback**: Visual indicators for form validation
- **CAPTCHA Protection**: Arithmetic CAPTCHA to prevent automated submissions
- **Dialog Box Notifications**: Professional popup messages for important alerts

### Technical Features
- **JSON Data Storage**: User data stored in JSON format
- **Password Hashing**: Secure password storage using PHP's `password_hash()`
- **AJAX Integration**: Asynchronous username checking
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Cross-browser Compatibility**: Tested on modern browsers

## 🚀 Live Demo

[View Live Demo](https://your-demo-link.com) *(Add your hosted demo link here)*

## 📋 Requirements

- **Web Server**: Apache/Nginx with PHP support
- **PHP Version**: 7.4 or higher
- **Browser**: Modern web browser with JavaScript enabled

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/amarmahaseth/User-Registration-System.git
   cd User-Registration-System
   ```

2. **Set up your web server**
   - Place the files in your web server directory (e.g., `htdocs` for XAMPP)
   - Ensure PHP is enabled on your server

3. **Configure permissions**
   - Make sure the `users.json` file is writable by the web server
   - Set appropriate file permissions (644 for files, 755 for directories)

4. **Access the application**
   - Open your web browser
   - Navigate to `http://localhost/User-Registration-System/`

## 📁 Project Structure

```
User-Registration-System/
├── index.html          # Main registration form
├── style.css           # Modern CSS styling
├── script.js           # JavaScript functionality
├── register.php        # Backend processing
├── users.json          # User data storage (auto-generated)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🔧 Configuration

### Customizing the Application

1. **Database Configuration**: Currently uses JSON file storage. For production, consider migrating to a proper database.

2. **CAPTCHA Customization**: Modify the CAPTCHA generation in `register.php`:
   ```php
   $num1 = rand(1, 10);  // Change range as needed
   $num2 = rand(1, 10);  // Change range as needed
   ```

3. **Styling**: Customize colors and styling in `style.css`:
   ```css
   :root {
       --primary-color: #3498db;    /* Primary blue */
       --primary-dark: #2980b9;     /* Darker blue */
       --success-color: #27ae60;    /* Green */
       --error-color: #e74c3c;      /* Red */
   }
   ```

## 🔒 Security Considerations

### Password Security
- Passwords are hashed using PHP's `password_hash()` with bcrypt
- NIST-compliant password policy
- No password expiration unless compromised
- Strong password recommendations without forced complexity

### Data Protection
- Input validation on both client and server side
- CAPTCHA protection against automated attacks
- JSON file permissions properly configured
- No sensitive data in client-side code

### Best Practices
- Regular security updates
- HTTPS recommended for production
- Regular backups of user data
- Monitor for suspicious activities

## 🧪 Testing

### Manual Testing Checklist
- [ ] Username availability checking
- [ ] Password strength validation
- [ ] CAPTCHA functionality
- [ ] Form submission with valid data
- [ ] Error handling for invalid inputs
- [ ] Responsive design on different screen sizes
- [ ] Cross-browser compatibility

### Automated Testing
Consider implementing automated tests using:
- PHPUnit for backend testing
- Jest or Mocha for JavaScript testing
- Selenium for end-to-end testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Amar Mahaseth**
- GitHub: [@amarmahaseth](https://github.com/amarmahaseth)
- Project Link: [https://github.com/amarmahaseth/User-Registration-System](https://github.com/amarmahaseth/User-Registration-System)

## 🙏 Acknowledgments

- NIST Digital Identity Guidelines (SP 800-63B)
- Modern CSS techniques and best practices
- PHP security best practices
- JavaScript ES6+ features

## 📊 Project Status

- ✅ Core functionality implemented
- ✅ NIST compliance achieved
- ✅ Responsive design completed
- ✅ Security features implemented
- 🔄 Continuous improvement in progress

## 🐛 Known Issues

- None currently reported

## 🔮 Future Enhancements

- [ ] Database integration (MySQL/PostgreSQL)
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Admin panel for user management
- [ ] API endpoints for mobile apps
- [ ] Two-factor authentication
- [ ] Rate limiting for registration attempts

---

⭐ **Star this repository if you find it helpful!** 