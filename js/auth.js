
//finale code below

// import { auth, db, doc, getDoc } from './firebase.js';
// import { 
//     onAuthStateChanged, 
//     signInWithEmailAndPassword, 
//     signOut 
// } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// // --- SECURITY: LIST OF ADMIN ONLY PAGES ---
// const adminPages = [
//     'dashboard.html', 
//     'transactions.html', 
//     'sales.html', 
//     'inventory.html', 
//     'products.html'
// ];

// // 1. GLOBAL SECURITY LISTENER
// onAuthStateChanged(auth, async (user) => {
//     const currentPath = window.location.pathname;
//     let page = currentPath.split("/").pop();
//     if (page === '') page = 'index.html';

//     if (user) {
//         // --- LOGGED IN ---
//         let role = localStorage.getItem('userRole');
        
//         // Fetch role if missing
//         if (!role) {
//             role = await getUserRole(user.uid);
//             localStorage.setItem('userRole', role);
//         }

//         // A. SECURITY: Kick Cashier out of Admin Pages
//         if (role !== 'admin' && adminPages.includes(page)) {
//             alert("Access Denied: Admins Only.");
//             window.location.href = 'pos.html'; 
//             return;
//         }

//         // B. UI: Hide Admin Links (Dashboard, etc.) for Cashiers
//         if (role !== 'admin') {
//             hideAdminLinks();
//         }

//         // C. Redirect from Login Page
//         if (page === 'index.html') {
//             if (role === 'admin') window.location.href = 'dashboard.html';
//             else window.location.href = 'pos.html';
//         }

//     } else {
//         // --- LOGGED OUT ---
//         if (page !== 'index.html') {
//             window.location.href = 'index.html';
//         }
//     }
// });

// // 2. HELPER: Hide Admin Links Safely
// function hideAdminLinks() {
//     // Select all links and buttons
//     const elements = document.querySelectorAll('a, button, .menu-item');
    
//     elements.forEach(el => {
//         const href = el.getAttribute('href');
//         const onclick = el.getAttribute('onclick') || '';
//         const text = el.innerText.toLowerCase();
//         const html = el.innerHTML.toLowerCase();

//         // --- SAFETY CHECK: NEVER HIDE LOGOUT ---
//         // If it looks like a logout button (has text 'log', icon 'sign-out', or calls logout function)
//         if (text.includes('log') || html.includes('sign-out') || onclick.includes('logout')) {
//             el.style.display = ''; // Ensure it is visible
//             if(el.parentElement.tagName === 'LI') el.parentElement.style.display = '';
//             return; // Skip hiding this element
//         }
//         // ---------------------------------------

//         // Hide ONLY if strict match with Admin Pages list
//         if (href && adminPages.includes(href)) {
//             el.style.display = 'none';
//             if(el.parentElement.tagName === 'LI') el.parentElement.style.display = 'none';
//         }
//     });
// }

// // 3. LOGOUT FUNCTION
// window.logout = function() {
//     if(confirm("Are you sure you want to logout?")) {
//         signOut(auth).then(() => {
//             localStorage.clear();
//             window.location.replace('index.html');
//         });
//     }
// };
// // Keeps old function name working just in case
// window.performLogout = window.logout; 

// // 4. LOGIN LOGIC
// const loginForm = document.getElementById('loginForm');
// if (loginForm) {
//     loginForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const email = document.getElementById('username').value.trim(); 
//         const pass = document.getElementById('password').value;
//         const errorMsg = document.getElementById('error-msg');
//         if(errorMsg) errorMsg.style.display = 'none';

//         try {
//             const cred = await signInWithEmailAndPassword(auth, email, pass);
//             const user = cred.user;
            
//             // Get User Name & Check Status
//             const userDoc = await getDoc(doc(db, "users", user.uid));
//             if (userDoc.exists()) {
//                 const data = userDoc.data();
//                 if (data.status === 'disabled') throw new Error("Account Disabled");
//                 localStorage.setItem('userName', data.name || 'User');
//             }

//             // Get Role & Redirect
//             const role = await getUserRole(user.uid);
//             localStorage.setItem('userRole', role);
            
//             if (role === 'admin') window.location.href = 'dashboard.html';
//             else window.location.href = 'pos.html';

//         } catch (err) {
//             if(errorMsg) {
//                 errorMsg.style.display = 'block';
//                 errorMsg.textContent = err.message;
//             } else {
//                 alert(err.message);
//             }
//         }
//     });
// }

// async function getUserRole(uid) {
//     try {
//         const snap = await getDoc(doc(db, "users", uid));
//         return snap.exists() && snap.data().role ? snap.data().role.toLowerCase() : 'cashier';
//     } catch(e) { return 'cashier'; }
// }




// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
// import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// // --- CONFIGURATION ---
// const firebaseConfig = {
//     apiKey: "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
//     authDomain: "pos-and-sales-monitoring.firebaseapp.com",
//     projectId: "pos-and-sales-monitoring",
//     storageBucket: "pos-and-sales-monitoring.firebasestorage.app",
//     messagingSenderId: "516453934117",
//     appId: "1:516453934117:web:1783067b8aa6b37373cbcc",
//     measurementId: "G-FT1G64DB9N"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // --- 1. LOGIN LOGIC ---
// window.addEventListener('load', () => {
//     const loginForm = document.getElementById('login-form') || document.getElementById('loginForm');
//     if (loginForm) {
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const submitBtn = loginForm.querySelector('button[type="submit"]');
//             if(submitBtn) submitBtn.innerText = "Logging in...";

//             const email = (document.getElementById('email') || document.getElementById('username')).value.trim();
//             const pass = document.getElementById('password').value;
//             const errorMsg = document.getElementById('error-msg');

//             try {
//                 const cred = await signInWithEmailAndPassword(auth, email, pass);
//                 const role = await getUserRole(cred.user.uid);
                
//                 // Redirect based on role
//                 if (role === 'admin') window.location.href = 'dashboard.html';
//                 else if (role === 'clerk') window.location.href = 'inventory.html';
//                 else window.location.href = 'pos.html';

//             } catch (err) {
//                 if(submitBtn) submitBtn.innerText = "Login";
//                 if(errorMsg) {
//                     errorMsg.style.display = 'block';
//                     errorMsg.textContent = "Login failed: " + err.message;
//                 } else {
//                     alert(err.message);
//                 }
//             }
//         });
//     }
// });

// // --- 2. SECURITY & SIDEBAR CONTROL ---
// // --- 2. SECURITY & SIDEBAR CONTROL ---
// onAuthStateChanged(auth, async (user) => {
//     const path = window.location.pathname;
//     const page = path.split('/').pop() || 'index.html'; // Default to index if empty

//     // A. Handle Not Logged In
//     if (!user) {
//         // If they are NOT on the login page (index.html), kick them back to it.
//         if (page !== 'index.html') {
//             window.location.href = 'index.html';
//         }
//         return;
//     }

//     // B. Get User Data (Role & Name)
//     let role = 'cashier';
//     let name = 'User';

//     try {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//             const data = userDoc.data();
//             role = data.role || 'cashier';
//             name = data.name || 'User';
//         }
//     } catch (e) {
//         console.error("Error fetching user data", e);
//     }

//     // C. INITIALIZE SIDEBAR
//     // We do NOT want the sidebar on the login page (index.html)
//     if (page !== 'index.html') {
//         // Dynamic import to avoid errors if sidebar.js isn't loaded on index
//         import('./sidebar.js').then(module => {
//             module.initSidebar({ name: name, role: role });
//         }).catch(err => console.log("Sidebar not loaded on this page"));
//     }

//     // D. REDIRECT IF ALREADY LOGGED IN (The "bouncer" logic)
//     // If they are on index.html but already logged in, send them to their main page.
//     if (page === 'index.html') {
//         if (role === 'admin') window.location.href = 'dashboard.html'; // or inventory.html if no dashboard
//         else if (role === 'clerk') window.location.href = 'inventory.html';
//         else window.location.href = 'pos.html';
//         return;
//     }

//     // E. STRICT PAGE ACCESS (Role restrictions)
//     if (role === 'clerk') {
//         // Clerks can only see Inventory and Products
//         if (!page.includes('inventory') && !page.includes('product')) {
//             alert("Access Denied: Clerks can only access Inventory.");
//             window.location.href = 'inventory.html';
//         }
//     } 
//     else if (role === 'cashier') {
//         // Cashiers can only see POS
//         if (!page.includes('pos')) {
//             alert("Access Denied: Cashiers can only access POS.");
//             window.location.href = 'pos.html';
//         }
//     }
// });

// // Global Logout Function
// window.logout = async function() {
//     await signOut(auth);
//     // Redirect back to index.html (your login page)
//     window.location.href = 'index.html';
// };
// window.confirmLogout = function() { window.logout(); };





import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// --- CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
    authDomain: "pos-and-sales-monitoring.firebaseapp.com",
    projectId: "pos-and-sales-monitoring",
    storageBucket: "pos-and-sales-monitoring.firebasestorage.app",
    messagingSenderId: "516453934117",
    appId: "1:516453934117:web:1783067b8aa6b37373cbcc",
    measurementId: "G-FT1G64DB9N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- HELPER: Get user role from Firestore ---
async function getUserRole(uid) {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
        return userDoc.data().role || 'cashier';
    }
    return 'cashier';
}

// --- 1. LOGIN LOGIC ---
window.addEventListener('load', () => {
    const loginForm = document.getElementById('login-form') || document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.innerText = "Logging in...";

            const email = (document.getElementById('email') || document.getElementById('username')).value.trim();
            const pass = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-msg');

            try {
                const cred = await signInWithEmailAndPassword(auth, email, pass);
                const role = await getUserRole(cred.user.uid);

                // Only admin and clerk are allowed to log in here
                if (role === 'admin' || role === 'clerk') {
                    window.location.href = 'inventory.html';
                } else {
                    // Unauthorized role — sign them out immediately and show error
                    await signOut(auth);
                    if (submitBtn) submitBtn.innerText = "Login";
                    const errorMsg = document.getElementById('error-msg');
                    if (errorMsg) {
                        errorMsg.style.display = 'block';
                        errorMsg.textContent = "Access Denied: Your account does not have permission to access this panel.";
                    } else {
                        alert("Access Denied: Your account does not have permission to access this panel.");
                    }
                }

            } catch (err) {
                if (submitBtn) submitBtn.innerText = "Login";
                if (errorMsg) {
                    errorMsg.style.display = 'block';
                    errorMsg.textContent = "Login failed: " + err.message;
                } else {
                    alert(err.message);
                }
            }
        });
    }
});

// --- 2. SECURITY & SIDEBAR CONTROL ---
onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    // A. Not logged in — kick to login page
    if (!user) {
        if (page !== 'index.html') {
            window.location.href = 'index.html';
        }
        return;
    }

    // B. Get User Data (Role & Name)
    let role = 'cashier';
    let name = 'User';

    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            role = data.role || 'cashier';
            name = data.name || 'User';
        }
    } catch (e) {
        console.error("Error fetching user data", e);
    }

    // C. Initialize Sidebar (not on login page)
    if (page !== 'index.html') {
        import('./sidebar.js').then(module => {
            module.initSidebar({ name: name, role: role });
        }).catch(err => console.log("Sidebar not loaded on this page"));
    }

    // D. Already logged in on login page — redirect to their home
    if (page === 'index.html') {
        if (role === 'admin' || role === 'clerk') {
            window.location.href = 'inventory.html';
        } else {
            // Cashier or unknown — sign out, they don't belong here
            await signOut(auth);
        }
        return;
    }

    // E. Strict Page Access
    if (role === 'clerk') {
        if (!page.includes('inventory') && !page.includes('product')) {
            alert("Access Denied: Clerks can only access Inventory.");
            window.location.href = 'inventory.html';
        }
    }
});

// --- Global Logout ---
window.logout = async function () {
    await signOut(auth);
    window.location.href = 'index.html';
};
window.confirmLogout = function () { window.logout(); };