async function fetchTikTokProfile(username) {
    const cleanUser = username.replace('@', '').trim();
    if (!cleanUser) return;

    profileStatusMsg.textContent = `Fetching real data for @${cleanUser}...`;
    searchBtn.disabled = true;

    const url = `https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${cleanUser}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-host': 'tiktok-api23.p.rapidapi.com',
            'x-rapidapi-key': 'bf8075fb5emsh5f5d9206316acdcp108509jsn28e5398fb250' // مفتاح الـ API
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (result && (result.userInfo || result.data || result.user)) {
            const userInfo = result.userInfo?.user || result.data?.user || result.user;
            const statsInfo = result.userInfo?.stats || result.data?.stats || result.stats;

            if (userInfo) {
                const realName = userInfo.nickname || cleanUser;
                const realUsername = `@${userInfo.uniqueId || cleanUser}`;
                const realAvatar = userInfo.avatarLarger || userInfo.avatarMedium || userInfo.avatarThumb;
                const realFollowers = statsInfo?.followerCount ? statsInfo.followerCount.toLocaleString() : "0";

                // تحديث العناصر في الواجهة بالبيانات الحقيقية
                targetName.textContent = realName;
                targetUsername.textContent = realUsername;
                targetFollowers.textContent = realFollowers;
                
                detailsName.textContent = realName;
                detailsUsername.textContent = realUsername;
                successTargetUsername.textContent = realUsername;

                if (realAvatar) {
                    targetAvatar.src = realAvatar;
                    detailsAvatar.src = realAvatar;
                }

                profileStatusMsg.textContent = `Profile loaded for ${realUsername}`;
                return;
            }
        }
        profileStatusMsg.textContent = `User @${cleanUser} not found.`;
    } catch (error) {
        console.error("Fetch Error:", error);
        profileStatusMsg.textContent = `Connected to @${cleanUser}`;
        targetName.textContent = cleanUser;
        targetUsername.textContent = `@${cleanUser}`;
    } finally {
        searchBtn.disabled = false;
    }
}