let emails = [];
let money = 10000;
let monthIndex = 0;
const months = ["November", "December", "January", "February", "March", "April"];

async function fetchEmails(month) {
    try {
        const response = await fetch(`resources/emails_${monthIndex}.json`);
        const newEmails = await response.json();
        emails = emails.concat(newEmails); // Append new emails to the existing list
        renderEmailList();
    } catch (error) {
        console.error('Error fetching emails:', error);
    }
}

function renderEmailList() {
    const emailList = document.querySelector('.email-list');
    const mainContent = document.querySelector('.main-content');
    emailList.innerHTML = '';
    mainContent.innerHTML = '';

    emails.forEach(email => {
        // Create and append list item
        const listItem = document.createElement('li');
        listItem.className = 'email-item';
        listItem.textContent = `${email.subject}`;
        listItem.setAttribute('data-email-id', email.id);
        emailList.appendChild(listItem);

        // Create email view
        const emailView = document.createElement('div');
        emailView.className = 'email-view';
        emailView.id = email.id;
        emailView.innerHTML = `
            <h3>${email.subject}</h3>
            ${email.body}
            <div class="decision-buttons">
                <button class="approve-button">Approve</button>
                <button class="deny-button">Deny</button>
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
        });

        // Add click events for decision buttons
        emailView.querySelector('.approve-button').addEventListener('click', () => {
            if (money >= email.cost) {
                money -= email.cost;
                updateStatusBar();
                alert('Request approved!');
            } else {
                alert('Not enough money to approve this request.');
            }
        });

        emailView.querySelector('.deny-button').addEventListener('click', () => {
            alert('Request denied!');
        });
    });
}

function updateStatusBar() {
    document.getElementById('money').textContent = money.toLocaleString();
}

function nextMonth() {
    monthIndex = (monthIndex + 1) % months.length; // Cycle through months
    const currentMonth = months[monthIndex];
    money += 100; // Add new money for the month
    document.getElementById('month').textContent = currentMonth;
    updateStatusBar();
    fetchEmails(currentMonth); // Load new batch of emails for the current month
}

// Fetch and render emails on page load
fetchEmails(months[monthIndex]);
document.getElementById('money').textContent = money.toLocaleString();
document.getElementById('month').textContent = months[monthIndex];

// Add event listener for the button to go to the next month
document.getElementById('next-month-button').addEventListener('click', nextMonth);