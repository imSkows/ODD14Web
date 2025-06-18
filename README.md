# WebProject - User Authentication and Environmental Awareness

This project provides a **web application** designed to allow users to authenticate, manage their account, take quizzes, and learn about environmental issues related to **pollution** and **overfishing**. It features a **leaderboard** and supports **newsletter subscriptions**. The app is built with **Node.js**, **Express**, and **MySQL**.

---

## Steps to Get Started

### 1. Setup MySQL Database

Before running the app, ensure you have a MySQL server running and then execute the following SQL code to create the required database and tables:

```sql
USE userAccount_db;

-- User authentication table
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'normal',
    points INT DEFAULT 0
);

-- Default admin account 
INSERT INTO user
VALUES (1, 'admin', 'admin@odd14', 'admin', 'admin', 1000); 
```
And for the quiz: 

```sql

CREATE TABLE quiz_category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);


CREATE TABLE quiz_question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    question_text TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES quiz_category(id) ON DELETE CASCADE
);


CREATE TABLE quiz_answer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT NOT NULL,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES quiz_question(id) ON DELETE CASCADE
);


INSERT INTO quiz_category (id, name, description) VALUES 
(1, 'pollution', 'Questions about ocean pollution and its effects'),
(2, 'overfishing', 'Questions about overfishing and its impact on marine life');

-- Questions 
INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (1, 1, 'What is the main mission of SDG 14?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(1, 'Reduce global poverty', FALSE),
(1, 'Conserve and sustainably use the oceans, seas, and marine resources', TRUE),
(1, 'Promote gender equality', FALSE),
(1, 'Encourage renewable energy', FALSE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (2, 1, 'What percentage of the Earth\'s surface is covered by oceans?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(2, '50%', FALSE),
(2, '60%', FALSE),
(2, '70%', TRUE),
(2, '80%', FALSE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (3, 1, 'Why are oceans essential to life on Earth?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(3, 'They produce more than 50% of the oxygen we breathe', FALSE),
(3, 'They regulate the global climate', FALSE),
(3, 'They harbor exceptional biodiversity', FALSE),
(3, 'All of the above', TRUE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (4, 1, 'What are the main challenges facing the oceans today?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(4, 'Plastic pollution', FALSE),
(4, 'Overfishing', TRUE),
(4, 'Ocean acidification', FALSE),
(4, 'All of the above', FALSE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (5, 1, 'How many tons of plastic end up in the oceans each year?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(5, '1 to 3 million tons', FALSE),
(5, '5 to 8 million tons', FALSE),
(5, '10 to 15 million tons', TRUE),
(5, 'More than 20 million tons', FALSE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (6, 1, 'What is ocean acidification and what is its main cause?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(6, 'A decrease in ocean pH caused by the absorption of human-emitted CO₂', FALSE),
(6, 'An increase in salinity due to industrial pollutants', TRUE),
(6, 'A natural phenomenon unrelated to human activities', FALSE),
(6, 'A reduction of nutrients in the water', FALSE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (7, 2, 'What is overfishing?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(7, 'The accidental capture of fish by fishing vessels', FALSE),
(7, 'Excessive fishing that exceeds the capacity of fish populations to replenish', TRUE),
(7, 'The use of fishing nets that do not comply with standards', FALSE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (8, 2, 'What proportion of fish stocks worldwide is exploited unsustainably?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(8, '10%', FALSE),
(8, '34%', TRUE),
(8, '25%', FALSE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (9, 2, 'What types of measures can reduce overfishing?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(9, 'Establish strict fishing quotas', FALSE),
(9, 'Create marine protected areas', FALSE),
(9, 'Combat illegal, unreported, and unregulated fishing', FALSE),
(9, 'All of the above', TRUE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (10, 2, 'Which type of fishing contributes most to overfishing?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(10, 'Artisanal fishing', FALSE),
(10, 'Recreational fishing', FALSE),
(10, 'Large-scale industrial fishing', TRUE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (11, 2, 'What are the environmental impacts of overfishing?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(11, 'Destruction of marine habitats (such as coral reefs)', FALSE),
(11, 'Decline in populations of certain species', FALSE),
(11, 'Imbalances in marine ecosystems', FALSE),
(11, 'All of the above', TRUE);


INSERT INTO quiz_question (id, category_id, question_text) 
VALUES (12, 2, 'What percentage of global catches corresponds to the accidental capture of non-target species (bycatch)?');
INSERT INTO quiz_answer (question_id, answer_text, is_correct) VALUES 
(12, '20%', TRUE),
(12, '10%', FALSE),
(12, '30%', FALSE);
```

### 2. Open the 'webproject' folder in your favorite IDE

### 3. In the file 'app.js', change the database credentials of your local machine (around line 50-52)

### 4. Open a terminal and launch the following command:

```
npm run devstart
```

### 5. Try the website!

## Features

- User authentication (login/register)
- Admin and regular user accounts
- Interactive quizzes with points system
- Database-driven quiz questions
- Leaderboard to track user scores
- Responsive design for desktop and mobile
- Educational content about ocean pollution and overfishing

## Admin Access

Default admin credentials:
- Email: admin@odd14
- Password: admin

Admin users can delete other accounts from the leaderboard
