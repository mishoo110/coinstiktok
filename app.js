document.addEventListener('DOMContentLoaded', () => {
    const views = {
        selectTier: document.getElementById('view-select-tier'),
        personalized: document.getElementById('view-personalized'),
        details: document.getElementById('view-details'),
        success: document.getElementById('view-success')
    };

    const usernameInput = document.getElementById('username-input');
    const searchBtn = document.getElementById('search-trigger-btn');
    const profileStatusMsg = document.getElementById('profile-status-message');
    
    const targetName = document.getElementById('target-name');
    const targetUsername = document.getElementById('target-username');
    const targetFollowers = document.getElementById('target-followers');
    const targetAvatar = document.getElementById('target-avatar');
    const detailsAvatar = document.getElementById('details-avatar');

    const tierCards = document.querySelectorAll('.tier-card');
    const confirmTierBtn = document.getElementById('confirm-tier-btn');
    
    const customAmountVal = document.getElementById('custom-amount-val');
    const keypad = document.getElementById('keypad');
    const keypadNextBtn = document.getElementById('keypad-next-btn');
    const backToTierBtn = document.getElementById('back-to-tier-btn');

    const backToCustomBtn = document.getElementById('back-to-custom-btn');
    const completeAllocationBtn = document.getElementById('complete-allocation-btn');
    const allocationLoader = document.getElementById('allocation-allocation-loader') || document.getElementById('allocation-loader');
    const acceptSuccessBtn = document.getElementById('accept-success-btn');

    const detailsName = document.getElementById('details-name');
    const detailsUsername = document.getElementById('details-username');
    const detailsCoins = document.getElementById('details-coins');
    const successCoinsAmount = document.getElementById('success-coins-amount');
    const successTargetUsername = document.getElementById('success-target-username');

    let selectedTier = '750';
    let isCustom = false;
    let customAmount = '';

    function switchView(viewName) {
        Object.values(views).forEach(view => view.classList.remove('active'));
        if (views[viewName]) views[viewName].classList.add('active');
    }

    // دالة تحميل البيانات وعرضها فوراً
    function loadProfile(username) {
        const cleanUser = username.replace('@', '').trim() || 'a1ali';

        searchBtn.disabled = true;
        profileStatusMsg.textContent = `Loading profile for @${cleanUser}...`;

        setTimeout(() => {
            const formattedName = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
            const formattedUsername = `@${cleanUser}`;

            targetName.textContent = formattedName;
            targetUsername.textContent = formattedUsername;
            targetFollowers.textContent = (Math.floor(Math.random() * 8000) + 500).toLocaleString();
            
            detailsName.textContent = formattedName;
            detailsUsername.textContent = formattedUsername;
            successTargetUsername.textContent = formattedUsername;

            profileStatusMsg.textContent = `Profile loaded for ${formattedUsername}`;
            searchBtn.disabled = false;
        }, 500);
    }

    // تحميل يوزر افتراضي أول ما الصفحة تفتح عشان ما تبقاش فاضية
    loadProfile(usernameInput.value || 'a1ali');

    searchBtn.addEventListener('click', () => loadProfile(usernameInput.value));
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') loadProfile(usernameInput.value);
    });

    tierCards.forEach(card => {
        card.addEventListener('click', () => {
            tierCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const tier = card.dataset.tier;
            const level = card.dataset.level;

            if (tier === 'custom') {
                isCustom = true;
                selectedTier = 'custom';
                confirmTierBtn.textContent = 'Continue to Custom Tier';
            } else {
                isCustom = false;
                selectedTier = tier;
                confirmTierBtn.textContent = `Confirm Level ${level}`;
            }
        });
    });

    confirmTierBtn.addEventListener('click', () => {
        if (isCustom) {
            switchView('personalized');
        } else {
            updateDetailsView(selectedTier);
            switchView('details');
        }
    });

    keypad.addEventListener('click', (e) => {
        const key = e.target.closest('.keypad-key');
        if (!key) return;

        const val = key.dataset.val;

        if (val === 'delete') {
            customAmount = customAmount.slice(0, -1);
        } else if (val === '000') {
            if (customAmount.length > 0 && customAmount.length < 7) {
                customAmount += '000';
            }
        } else {
            if (customAmount.length < 8) {
                customAmount += val;
            }
        }

        const numericVal = parseInt(customAmount, 10) || 0;
        customAmountVal.textContent = numericVal.toLocaleString();
        keypadNextBtn.disabled = numericVal <= 0;
    });

    backToTierBtn.addEventListener('click', () => switchView('selectTier'));

    keypadNextBtn.addEventListener('click', () => {
        const numericVal = parseInt(customAmount, 10) || 0;
        updateDetailsView(numericVal.toLocaleString());
        switchView('details');
    });

    function updateDetailsView(amount) {
        detailsCoins.textContent = amount;
        successCoinsAmount.textContent = amount;
        successTargetUsername.textContent = targetUsername.textContent;
    }

    backToCustomBtn.addEventListener('click', () => {
        if (isCustom) switchView('personalized');
        else switchView('selectTier');
    });

    completeAllocationBtn.addEventListener('click', () => {
        if (allocationLoader) allocationLoader.classList.add('show');
        setTimeout(() => {
            if (allocationLoader) allocationLoader.classList.remove('show');
            switchView('success');

            // تشغيل صوت النجاح فور ظهور شاشة السسسيس
            const successSound = document.getElementById('successSound');
            if (successSound) {
                successSound.currentTime = 0;
                successSound.play().catch(err => console.log(err));
            }
        }, 4000);
    });

    acceptSuccessBtn.addEventListener('click', () => {
        customAmount = '';
        customAmountVal.textContent = '0';
        keypadNextBtn.disabled = true;
        switchView('selectTier');
    });
});
