// app.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reminderForm');
    const remindersList = document.getElementById('reminders');
    let reminders = JSON.parse(localStorage.getItem('reminders')) || [];

    function saveReminders() {
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }

    function showNotification(subject) {
        if (Notification.permission === 'granted') {
            new Notification(`زمان مرور درس: ${subject}`);
        }
    }

    function checkReminders() {
        const now = new Date().getTime();
        reminders.forEach((reminder, index) => {
            if (now >= new Date(reminder.time).getTime()) {
                showNotification(reminder.subject);
                reminders.splice(index, 1);
            }
        });
        saveReminders();
        displayReminders();
    }

    function displayReminders() {
        remindersList.innerHTML = '';
        reminders.forEach(reminder => {
            const li = document.createElement('li');
            li.textContent = `${reminder.subject} - ${new Date(reminder.time).toLocaleString()}`;
            remindersList.appendChild(li);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = document.getElementById('subject').value;
        const time = document.getElementById('reminderTime').value;

        reminders.push({ subject, time });
        saveReminders();
        displayReminders();
        form.reset();
    });

    // درخواست مجوز نوتیفیکیشن
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // چک هر دقیقه یکبار
    setInterval(checkReminders, 60000);
    displayReminders();
});
