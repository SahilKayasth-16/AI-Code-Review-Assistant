import React, { useState } from "react";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock, FaPalette, FaTrashAlt, FaSignOutAlt } from "react-icons/fa";
import "../styles/Settings.css";

const Settings = () => {
    const { user, logout } = useAuth();
    
    // Profile Form
    const [name, setName] = useState(user?.name || "Developer");
    const [email, setEmail] = useState(user?.email || "developer@test.com");
    const [profileSaving, setProfileSaving] = useState(false);

    // Password Form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordSaving, setPasswordSaving] = useState(false);

    // Delete Modal
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setProfileSaving(true);
        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProfileSaving(false);
        alert("Profile details updated successfully!");
    };

    const handleSavePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        setPasswordSaving(true);
        // Simulate save
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPasswordSaving(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        alert("Password updated successfully!");
    };

    return (
        <div className="settings-page">
            {/* Profile Panel */}
            <div className="settings-card">
                <div className="card-header">
                    <FaUser className="header-icon" />
                    <div>
                        <h3>Profile Settings</h3>
                        <p>Update your personal information and contact email.</p>
                    </div>
                </div>
                
                <form onSubmit={handleSaveProfile} className="settings-form">
                    <div className="settings-grid">
                        <div className="input-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                required
                            />
                        </div>
                    </div>
                    <div className="settings-footer">
                        <Button type="submit" variant="primary" loading={profileSaving}>
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>

            {/* Password Panel */}
            <div className="settings-card">
                <div className="card-header">
                    <FaLock className="header-icon" />
                    <div>
                        <h3>Security Credentials</h3>
                        <p>Change your account password to maintain security.</p>
                    </div>
                </div>

                <form onSubmit={handleSavePassword} className="settings-form">
                    <div className="settings-grid password-grid">
                        <div className="input-group">
                            <label>Current Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>New Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Confirm New Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="settings-footer">
                        <Button type="submit" variant="primary" loading={passwordSaving}>
                            Change Password
                        </Button>
                    </div>
                </form>
            </div>

            {/* Theme Panel */}
            <div className="settings-card theme-card">
                <div className="card-header">
                    <FaPalette className="header-icon" />
                    <div>
                        <h3>Appearance Settings</h3>
                        <p>Customize the UI color mode preferences.</p>
                    </div>
                </div>
                <div className="theme-options">
                    <div className="theme-option disabled">
                        <span className="theme-badge">Light</span>
                    </div>
                    <div className="theme-option disabled">
                        <span className="theme-badge">Dark</span>
                    </div>
                    <div className="theme-option disabled">
                        <span className="theme-badge">System</span>
                    </div>
                </div>
                <div className="theme-coming-soon">
                    <span>Theme Customization (Coming Soon)</span>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-card danger-zone-card">
                <div className="card-header danger-header">
                    <FaTrashAlt className="header-icon danger-icon" />
                    <div>
                        <h3>Danger Zone</h3>
                        <p>Critical actions relating to your user profile session.</p>
                    </div>
                </div>
                <div className="danger-actions-row">
                    <Button 
                        variant="secondary" 
                        icon={<FaSignOutAlt />} 
                        onClick={logout}
                        className="danger-btn-secondary"
                    >
                        Sign Out Session
                    </Button>
                    <Button 
                        variant="danger" 
                        icon={<FaTrashAlt />} 
                        onClick={() => setIsDeleteOpen(true)}
                        disabled
                    >
                        Delete User Account (Coming Soon)
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                title="Delete Account Confirmation"
                actions={
                    <>
                        <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" disabled>
                            Confirm Delete
                        </Button>
                    </>
                }
            >
                <p>Warning: Deleting your account will permanently purge all historical code scans, saved results, and user profile data. This action is irreversible.</p>
            </Modal>
        </div>
    );
};

export default Settings;
