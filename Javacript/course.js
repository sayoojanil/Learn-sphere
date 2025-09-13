   // API Configuration
        const API_BASE_URL = 'https://api-hammadii-6.onrender.com/';
        const API_ENDPOINTS = {
            signup: '/signup',
            login: '/loginWithEmail',
            courses: '/courses'
        };

        // DOM Elements
        const signupBtn = document.getElementById('signup-btn');
        const loginBtn = document.getElementById('login-btn');
        const signupModal = document.getElementById('signup-modal');
        const loginModal = document.getElementById('login-modal');
        const closeBtns = document.querySelectorAll('.close-btn');
        const showLogin = document.getElementById('show-login');
        const showSignup = document.getElementById('show-signup');
        const signupForm = document.getElementById('signup-form');
        const loginForm = document.getElementById('login-form');
        const signupError = document.getElementById('signup-error');
        const loginError = document.getElementById('login-error');
        const signupLoading = document.getElementById('signup-loading');
        const loginLoading = document.getElementById('login-loading');
        const coursesLoading = document.getElementById('courses-loading');
        const authButtons = document.getElementById('auth-buttons');
        const userProfile = document.getElementById('user-profile');
        const userNameDisplay = document.getElementById('user-name');
        const logoutBtn = document.getElementById('logout-btn');
        const userProfileIcon = document.getElementById('user-profile-icon');
        const userNameDropdown = document.getElementById('user-name-dropdown');
        const searchInput = document.getElementById('search-input');
        const categoryFilter = document.getElementById('category-filter');
        const difficultyFilter = document.getElementById('difficulty-filter');
        const coursesGrid = document.getElementById('courses-grid');
        const signupSubmit = document.getElementById('signup-submit');
        const loginSubmit = document.getElementById('login-submit');
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('nav-links');
        const fetchError = document.getElementById('fetch-error');
        const noCoursesError = document.getElementById('no-courses-error');

        // Axios instance
        const api = axios.create({
            baseURL: API_BASE_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Function to update auth UI
        function updateAuthUI() {
            const token = localStorage.getItem('token');
            const userName = localStorage.getItem('userName');

            if (token && userName) {
                signupBtn.style.display = 'none';
                loginBtn.style.display = 'none';
                userProfile.style.display = 'flex';
                userNameDisplay.textContent = userName || 'User';
            } else {
                signupBtn.style.display = 'inline-block';
                loginBtn.style.display = 'inline-block';
                userProfile.style.display = 'none';
                userNameDisplay.textContent = '';
            }
        }

        // Function to toggle hamburger menu
        function toggleMenu() {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        }

        // Function to fetch courses from API
        async function fetchCourses() {
            try {
                coursesLoading.classList.add('active');
                coursesGrid.style.display = 'none';
                fetchError.style.display = 'none';
                noCoursesError.style.display = 'none';
                const response = await api.get(API_ENDPOINTS.courses);
                console.log('Fetched Courses:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error fetching courses:', error);
                fetchError.style.display = 'block';
                return [];
            } finally {
                coursesLoading.classList.remove('active');
                coursesGrid.style.display = 'grid';
            }
        }

        // Function to render courses
        function renderCourses(courses) {
            coursesGrid.innerHTML = '';
            fetchError.style.display = 'none';
            noCoursesError.style.display = courses.length === 0 ? 'block' : 'none';
            if (courses.length === 0) {
                return;
            }
            courses.forEach((course) => {
                const courseCard = document.createElement('div');
                courseCard.className = 'course-card';
                courseCard.setAttribute('data-category', course.category);
                courseCard.setAttribute('data-difficulty', course.difficulty);
                courseCard.innerHTML = `
                    <div class="course-image">
                        ${course.image ? `<img src="${course.image}" alt="${course.title}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">` : ''}
                        <i class="fas fa-${getCourseIcon(course.category)}" style="${course.image ? 'display:none' : ''}"></i>
                    </div>
                    <div class="course-content">
                        <span class="course-category">${course.category}</span>
                        <h3 class="course-title">${course.title}</h3>
                        <span><strong>${course.provided_by}</strong></span><br>
                        <div class="course-meta">
                            <div class="course-instructor">
                                <strong><h2><span>₹${course.amount}</span></strong></h2>
                            </div>
                            <div class="course-rating">
                                ${generateStars(course.rating)}
                                <span>${course.rating}</span>
                            </div>
                        </div>
                    </div>
                `;
                courseCard.addEventListener('click', () => {
                    localStorage.setItem('selectedCourse', JSON.stringify(course));
                    window.location.href = 'course-details.html';
                });
                coursesGrid.appendChild(courseCard);
            });
        }

        // Function to get course icon
        function getCourseIcon(category) {
            const icons = {
                'coding': 'js',
                'Web Development': 'js',
                'Data Science': 'database',
                'Design': 'paint-brush',
                'Mobile Development': 'mobile-alt',
                'Business': 'chart-line',
                'Marketing': 'bullhorn',
                'Cloud Computing': 'cloud'
            };
            return icons[category] || 'book';
        }

        // Function to generate star rating
        function generateStars(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    stars += '<i class="fas fa-star"></i>';
                } else if (i === fullStars && hasHalfStar) {
                    stars += '<i class="fas fa-star-half-alt"></i>';
                } else {
                    stars += '<i class="far fa-star"></i>';
                }
            }
            return stars;
        }

        // Search and filter function
        async function filterCourses() {
            const searchText = searchInput.value.toLowerCase();
            console.log('Search Text:', searchText);
            const selectedCategory = categoryFilter.value;
            const selectedDifficulty = difficultyFilter.value;

            let filter = {};
            if (searchText) {
                filter.where = {
                    or: [
                        { title: { like: searchText, options: 'i' } },
                        { description: { like: searchText, options: 'i' } },
                        { category: { like: searchText, options: 'i' } }
                    ]
                };
            }
            if (selectedCategory !== 'all') {
                filter.where = { ...filter.where, category: selectedCategory };
            }
            console.log('Selected Category:', selectedCategory);

            if (selectedDifficulty !== 'all') {
                filter.where = { ...filter.where, difficulty: selectedDifficulty };
            }

            try {
                coursesLoading.classList.add('active');
                coursesGrid.style.display = 'none';
                fetchError.style.display = 'none';
                noCoursesError.style.display = 'none';
                const response = await api.get(API_ENDPOINTS.courses, { params: { filter: JSON.stringify(filter) } });
                renderCourses(response.data);
            } catch (error) {
                console.error('Error filtering courses:', error);
                fetchError.style.display = 'block';
                noCoursesError.style.display = 'none';
                coursesGrid.innerHTML = '';
            } finally {
                coursesLoading.classList.remove('active');
                coursesGrid.style.display = 'grid';
            }
        }

        // Event listeners for search and filters
        searchInput.addEventListener('input', filterCourses);
        categoryFilter.addEventListener('change', filterCourses);
        difficultyFilter.addEventListener('change', filterCourses);

        // Hamburger menu event listener
        hamburger.addEventListener('click', toggleMenu);

        // Close menu when clicking a nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            });
        });

        // Initial render of courses
        document.addEventListener('DOMContentLoaded', async () => {
            updateAuthUI();
            const courses = await fetchCourses();
            renderCourses(courses);
        });

        // Event listeners
        userProfileIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            userNameDropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!userProfileIcon.contains(e.target) && !userNameDropdown.contains(e.target)) {
                userNameDropdown.classList.remove('active');
            }
        });

        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'flex';
            signupError.style.display = 'none';
            signupLoading.style.display = 'none';
        });

        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
            loginError.style.display = 'none';
            loginLoading.style.display = 'none';
        });

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                signupModal.style.display = 'none';
                loginModal.style.display = 'none';
                signupError.style.display = 'none';
                loginError.style.display = 'none';
                signupLoading.style.display = 'none';
                loginLoading.style.display = 'none';
            });
        });

        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'flex';
            signupError.style.display = 'none';
            loginError.style.display = 'none';
            signupLoading.style.display = 'none';
            loginLoading.style.display = 'none';
        });

        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'flex';
            signupError.style.display = 'none';
            loginError.style.display = 'none';
            signupLoading.style.display = 'none';
            loginLoading.style.display = 'none';
        });

        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('rememberMe');
            updateAuthUI();
            alert('Logged out successfully!');
        });

        window.addEventListener('click', (e) => {
            if (e.target === signupModal) {
                signupModal.style.display = 'none';
                signupError.style.display = 'none';
                signupLoading.style.display = 'none';
            }
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
                loginError.style.display = 'none';
                loginLoading.style.display = 'none';
            }
        });

        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            signupError.style.display = 'none';
            signupLoading.style.display = 'block';
            signupSubmit.disabled = true;

            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm').value;

            if (password !== confirmPassword) {
                signupError.textContent = 'Passwords do not match';
                signupError.style.display = 'block';
                signupLoading.style.display = 'none';
                signupSubmit.disabled = false;
                return;
            }

            try {
                const response = await api.post(API_ENDPOINTS.signup, {
                    name,
                    email,
                    password
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userName', name);
                alert('Account created successfully! Welcome to LearnSphere.');
                signupModal.style.display = 'none';
                signupForm.reset();
                updateAuthUI();
            } catch (error) {
                signupError.textContent = error.response?.data?.message || 'An error occurred during signup';
                signupError.style.display = 'block';
            } finally {
                signupLoading.style.display = 'none';
                signupSubmit.disabled = false;
            }
        });

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            loginError.style.display = 'none';
            loginLoading.style.display = 'block';
            loginSubmit.disabled = true;

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const remember = document.getElementById('remember').checked;

            try {
                const response = await api.post(API_ENDPOINTS.login, {
                    email,
                    password
                });

                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userName', response.data.name || response.data.userName || 'User');

                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                } else {    
                    localStorage.removeItem('rememberMe');
                }

                alert('Login successful! Welcome back.');
                loginModal.style.display = 'none';
                loginForm.reset();
                updateAuthUI();
            } catch (error) {
                loginError.textContent = error.response?.data?.message || 'Invalid email or password';
                loginError.style.display = 'block';
            } finally {
                loginLoading.style.display = 'none';
                loginSubmit.disabled = false;
            }
        });