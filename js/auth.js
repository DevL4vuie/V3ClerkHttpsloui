import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
    authDomain: "pos-and-sales-monitoring.firebaseapp.com",
    projectId: "pos-and-sales-monitoring",
    storageBucket: "pos-and-sales-monitoring.firebasestorage.app",
    messagingSenderId: "516453934117",
    appId: "1:516453934117:web:1783067b8aa6b37373cbcc",
    measurementId: "G-FT1G64DB9N"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// Returns full user doc data
async function getUserData(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) return userDoc.data();
    return null;
}

// --- 1. LOGIN LOGIC ---
window.addEventListener('load', () => {
    const loginForm = document.getElementById('login-form') || document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const errorMsg  = document.getElementById('error-msg');
        if (submitBtn) submitBtn.innerText = "Logging in...";

        const email = (document.getElementById('email') || document.getElementById('username')).value.trim();
        const pass  = document.getElementById('password').value;

        try {
            const cred     = await signInWithEmailAndPassword(auth, email, pass);
            const userData = await getUserData(cred.user.uid);
            const role     = userData?.role || 'cashier';

            // ✅ CHECK: disabled or archived
            if (userData?.status === 'disabled' || userData?.archived === true) {
                await signOut(auth);
                if (submitBtn) submitBtn.innerText = "Login";
                if (typeof window.showDisabledModal === 'function') {
                    window.showDisabledModal();
                } else {
                    alert('Your account has been disabled by the administrator. Please contact admin for assistance.');
                }
                return;
            }

            if (role === 'admin' || role === 'clerk') {
                window.location.href = 'inventory.html';
            } else {
                await signOut(auth);
                if (submitBtn) submitBtn.innerText = "Login";
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                    errorMsg.textContent   = "Access Denied: Your account does not have permission to access this panel.";
                } else {
                    alert("Access Denied: Your account does not have permission to access this panel.");
                }
            }

        } catch (err) {
            if (submitBtn) submitBtn.innerText = "Login";
            if (errorMsg) {
                errorMsg.style.display = 'block';
                errorMsg.textContent   = "Login failed: " + err.message;
            } else {
                alert(err.message);
            }
        }
    });
});

// --- 2. SECURITY & SIDEBAR CONTROL ---
onAuthStateChanged(auth, async (user) => {
    const page = window.location.pathname.split('/').pop() || 'index.html';

    if (!user) {
        if (page !== 'index.html') window.location.href = 'index.html';
        return;
    }

    let role = 'cashier';
    let name = 'User';

    try {
        const userData = await getUserData(user.uid);
        if (userData) {
            role = userData.role   || 'cashier';
            name = userData.name   || 'User';

            // ✅ CHECK: kick out disabled/archived users from any page
            if (userData.status === 'disabled' || userData.archived === true) {
                await signOut(auth);
                window.location.href = 'index.html';
                return;
            }
        }
    } catch (e) {
        console.error("Error fetching user data", e);
    }

    if (page !== 'index.html') {
        import('./sidebar.js').then(module => {
            module.initSidebar({ name, role });
        }).catch(err => console.log("Sidebar not loaded on this page"));
    }

    if (page === 'index.html') {
        if (role === 'admin' || role === 'clerk') {
            window.location.href = 'inventory.html';
        } else {
            await signOut(auth);
        }
        return;
    }

    if (role === 'clerk') {
        if (!page.includes('inventory') && !page.includes('product')) {
            alert("Access Denied: Clerks can only access Inventory.");
            window.location.href = 'inventory.html';
        }
    }
});

// --- Global Logout ---
window.logout         = async function() { await signOut(auth); window.location.href = 'index.html'; };
window.confirmLogout  = function()       { window.logout(); };
