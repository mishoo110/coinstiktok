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
    const allocationLoader = document.getElementById('allocation-loader');
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

    // محاكاة تحميل بيانات المستخدم محلياً لضمان السرعة والاستقرار
    function loadProfile(username) {
        const cleanUser = username.replace('@', '').trim();
        if (!cleanUser) return;

        searchBtn.disabled = true;
        profileStatusMsg.textContent = `Fetching profile for @${cleanUser}...`;

        setTimeout(() => {
            targetName.textContent = cleanUser.charAt(0).toUpperCase() + cleanUser.slice(1);
            targetUsername.textContent = `@${cleanUser}`;
            targetFollowers.textContent = Math.floor(Math.random() * 5000) + 120;
            
            detailsName.textContent = targetName.textContent;
            detailsUsername.textContent = targetUsername.textContent;

            profileStatusMsg.textContent = `Profile loaded for @${cleanUser}`;
            searchBtn.disabled = false;
        }, 800);
    }

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
        successTargetUsername.textContent = targetUsername.textContent || '@user';
    }

    backToCustomBtn.addEventListener('click', () => {
        if (isCustom) switchView('personalized');
        else switchView('selectTier');
    });

    completeAllocationBtn.addEventListener('click', () => {
        allocationLoader.classList.add('show');
        setTimeout(() => {
            allocationLoader.classList.remove('show');
            switchView('success');

            // تشغيل صوت النجاح فور ظهور الشاشة
            const successSound = document.getElementById('successSound');
            if (successSound) {
                successSound.currentTime = 0;
                successSound.play().catch(err => console.log(err));
            }
        }, 4000);
    });

    acceptSuccessBtn.addEventListener('click', () => {
        usernameInput.value = '';
        targetName.textContent = '';
        targetUsername.textContent = '@';
        targetFollowers.textContent = '0';
        customAmount = '';
        customAmountVal.textContent = '0';
        keypadNextBtn.disabled = true;
        profileStatusMsg.textContent = 'Enter a username and click Load';
        switchView('selectTier');
    });
});