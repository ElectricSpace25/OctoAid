let emails = [];
let money = 2000;
let day = 1;

async function fetchEmails() {
    try {
        const response = await fetch('emails.json');
        emails = await response.json();
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
    document.getElementById('money').textContent = money;
}

function nextDay() {
    day++;
    money += 100; // Add new money for the day
    document.getElementById('day').textContent = day;
    updateStatusBar();
    fetchEmails(); // Load new batch of emails
}

// Fetch and render emails on page load
fetchEmails();