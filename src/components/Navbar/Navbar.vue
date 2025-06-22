<template>
  <div class="modern-navbar">
    <div class="navbar-left">
      <button @click="$emit('toggle-sidebar')" class="sidebar-toggle">
        <i class="fas fa-bars"></i>
      </button>
      <div class="brand">
        <router-link to="/" class="brand-link">
          <i class="fas fa-store brand-icon"></i>
          <span class="brand-text">ScarlatMarket</span>
        </router-link>
      </div>
    </div>
    
    <div class="navbar-center">
      <div class="search-container">
        <i class="fas fa-search search-icon"></i>
        <input type="text" placeholder="Buscar produtos..." class="search-input">
      </div>
    </div>
    
    <div class="navbar-right">
      <div class="nav-actions">
        <button class="action-btn">
          <i class="fas fa-bell"></i>
          <span class="notification-badge">3</span>
        </button>
        <button class="action-btn">
          <i class="fas fa-cog"></i>
        </button>
        <div class="user-menu">
          <button class="user-btn">
            <i class="fas fa-user-circle"></i>
            <span>Admin</span>
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
};
</script>

<style scoped>
.modern-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 20px;
  height: 75px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.brand-link {
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 700;
  gap: 10px;
}

.brand-icon {
  color: #ffd700;
  font-size: 1.6rem;
}

.brand-text {
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-center {
  flex: 1;
  max-width: 500px;
  margin: 0 40px;
}

.search-container {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px 20px 12px 45px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 0.95rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.3);
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-btn {
  position: relative;
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.notification-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4757;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.user-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-btn i:first-child {
  font-size: 1.3rem;
}

.user-btn i:last-child {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .modern-navbar {
    padding: 0 15px;
  }
  
  .navbar-center {
    display: none;
  }
  
  .brand-text {
    display: none;
  }
  
  .nav-actions {
    gap: 10px;
  }
  
  .user-btn span {
    display: none;
  }
}

@media (max-width: 480px) {
  .navbar-left {
    gap: 10px;
  }
  
  .nav-actions {
    gap: 5px;
  }
  
  .action-btn {
    padding: 8px;
  }
}
</style>