(function() {
    // Function to get a cookie by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Step 1: Check if the "auth" cookie is present
    const authCookie = getCookie("auth");
    if (!authCookie) {
        // If "auth" cookie is not present, redirect to the login page
        if (window.location.origin === "https://server.wized.com") {
            // If we're on server.wized.com, use n.path for Wized redirection
            window.Wized = window.Wized || [];
            window.Wized.push((Wized) => {
                Wized.data.n.path = "/auth/login";
            });
        } else {
            // Redirect directly for other origins
            window.location.href = "/auth/login";
        }
        return; // Stop further logic since the user is not authenticated
    }

    // Step 2: Check if "isAdmin" cookie is present and its value is true or false
    const isAdminCookie = getCookie("isAdmin");
    if (isAdminCookie === "true") {
        // If isAdmin is true, no need to proceed further
        return;
    }

    // Step 3: Check the "hasAccess" cookie
    const hasAccessCookie = getCookie("hasAccess");
    if (hasAccessCookie === "false") {
        // If hasAccess is false, redirect to the subscription error page
        if (window.location.origin === "https://server.wized.com") {
            // Use n.path for Wized redirection
            window.Wized = window.Wized || [];
            window.Wized.push((Wized) => {
                Wized.data.n.path = "/dashboard/subscription-error";
            });
        } else {
            // Redirect directly for other origins
            window.location.href = "/dashboard/subscription-error";
        }
    }
})();
