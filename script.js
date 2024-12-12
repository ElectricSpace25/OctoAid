import { Email } from './email.js';

let money = 0;
let monthIndex = 0;
const months = ["September", "November", "December", "January", "February", "March", "April"];
const emailsByMonth = {};

async function fetchEmails() {
    try {
        const response = await fetch(`resources/emails_${monthIndex}.json`);
        const emailData = await response.json();
        const emails = emailData.map(emailData => new Email(emailData.id, emailData.subject, emailData.cost, emailData.body));

        // Add emails to the specific month
        emailsByMonth[months[monthIndex]] = emails;

        // Render the email list
        renderEmailList();
    } catch (error) {
        console.error('Error fetching emails:', error);
    }
}

function renderEmailList(selectedEmailId = null) {
    const emailList = document.querySelector('.email-list');
    const mainContent = document.querySelector('.main-content');
    emailList.innerHTML = '';
    mainContent.innerHTML = '';

    // Get the months in reverse order
    const monthsInReverse = Object.keys(emailsByMonth).reverse();

    // Render emails grouped by month in reverse order
    monthsInReverse.forEach(month => {
        if (emailsByMonth[month].length > 0) { // Only render if there are emails for the month
            // Create and append month section
            const monthSection = document.createElement('div');
            monthSection.className = 'month-section';
            monthSection.innerHTML = `<h2>${month}</h2>`;

            // Gray out the month header if it doesn't match the current month
            if (month !== months[monthIndex]) {
                monthSection.querySelector('h2').classList.add('grayed-out');
            }

            emailList.appendChild(monthSection);

            emailsByMonth[month].forEach(email => {
                // Create and append list item
                const listItem = document.createElement('li');
                listItem.className = 'email-item';
                listItem.textContent = `${email.subject}`;

                // Add class based on email status
                if (email.status === 'approved') {
                    listItem.classList.add('approved');
                    listItem.classList.add('resolved');
                } else if (email.status === 'denied') {
                    listItem.classList.add('denied');
                    listItem.classList.add('resolved');
                } else if (email.status === 'read') {
                    listItem.classList.add('resolved')
                }
                
                monthSection.appendChild(listItem);

                // Create email view
                const emailView = document.createElement('div');
                emailView.className = 'email-view';
                emailView.id = email.id;
                emailView.innerHTML = `
                    <h3>${email.subject}</h3>
                    ${email.body}
                    <div class="decision-buttons">
                        ${email.cost > 0 && email.status == 'pending' ? `
                            <button class="approve-button">Approve</button>
                            <button class="deny-button">Deny</button>
                        ` : ''}
                    </div>
                `;
                mainContent.appendChild(emailView);

                // Add click event for the list item
                listItem.addEventListener('click', () => {
                    // Remove 'active' class from all email views
                    document.querySelectorAll('.email-view').forEach(view => {
                        view.classList.remove('active');
                    });
                    // Add 'active' class to the current email view
                    emailView.classList.add('active');

                    // Remove 'selected' class from all email items
                    document.querySelectorAll('.email-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    // Add 'selected' class to the current list item
                    listItem.classList.add('selected');

                    // Mark current list item as read if cost is zero
                    if (email.cost === 0 && email.status !== 'read') {
                        email.status = 'read';
                        renderEmailList(email.id);
                    }
                });

                // Add click events for decision buttons if they exist
                if (email.cost > 0 && email.status == 'pending') {
                    emailView.querySelector('.approve-button').addEventListener('click', () => {
                        if (money >= email.cost) {
                            money -= email.cost;
                            email.status = 'approved';
                            alert('Request approved!');
                        } else {
                            alert('Not enough money to approve this request.');
                        }
                        updateStatusBar();
                        renderEmailList(email.id);
                    });

                    emailView.querySelector('.deny-button').addEventListener('click', () => {
                        email.status = 'denied';
                        alert('Request denied!');
                        updateStatusBar();
                        renderEmailList(email.id);
                    });
                }

                // Re-select the email if it was previously selected
                if (email.id === selectedEmailId) {
                    listItem.classList.add('selected');
                    emailView.classList.add('active');
                }
            });
        }
    });
}

function updateStatusBar() {
    document.getElementById('money').textContent = money.toLocaleString();
}

function nextMonth() {
    monthIndex += 1;
    const currentMonth = months[monthIndex];
    switch (currentMonth) {
        case "November":
            money += 10000;
            break;
        case "December":
            money += 13000;
            break;
        case "January":
            money += 20000;
            break;
        case "February":
            money += 17000;
            break;
        case "March":
            money += 5000;
            break;
        case "April":
            money += 10000;
            break;
    }
    document.getElementById('month').textContent = currentMonth;
    updateStatusBar();
    fetchEmails(currentMonth); // Load new batch of emails for the current month
}

// Fetch and render emails on page load
fetchEmails(months[monthIndex]);
document.getElementById('money').textContent = money.toLocaleString();
document.getElementById('month').textContent = months[monthIndex];

// Add event listener for the button to go to the next month
document.getElementById('end-month-button').addEventListener('click', () => {
    const currentMonthEmails = emailsByMonth[months[monthIndex]] || [];
    if (currentMonthEmails.some(email => email.status === 'pending')) {
        alert("Read every email and accept/reject all requests before ending the month!")
    } else {
        const userConfirmed = confirm('Are you sure you want to end the month?');
        if (userConfirmed) {
            nextMonth();
        }
    }
});