import React from "react";
import { Edit3, UserRound, Wallet } from "lucide-react";
import { roles } from "../../../mocks/roles.mock";
import { formatCurrency } from "../../../utils/formatters";
import { initials } from "../../../utils/roleUtils";
import { getProfile } from "../profileSelectors";

function ProfileField({ label, value }) {
  return (
    <div className="profile-field">
      <span>{label}</span>
      <strong>{value || "-"}</strong>
    </div>
  );
}

function RatingValue({ value }) {
  const rating = Number(value || 4.72);
  return (
    <strong className="profile-rating">
      {rating.toFixed(2)}
      <span>★★★★★</span>
    </strong>
  );
}

function ProfilePage({ user, role }) {
  const profile = getProfile(user, role);
  const displayRole = roles[profile.role] || roles[role] || "Guest";
  const isJockey = profile.role === "Jockey" || role === "Jockey";

  return (
    <section className="profile-page">
      <div className="section-heading tight">
        <span>User Profile</span>
        <h1>Account and profile information</h1>
      </div>

      <section className="profile-hero panel">
        <div className="profile-avatar-card">
          <div className="profile-avatar-paper">
            <UserRound size={34} />
          </div>
          <span />
        </div>
        <div className="profile-title">
          <div>
            <h2>{profile.fullName || "Guest user"}</h2>
            <span className="profile-status">Verified & Active</span>
          </div>
          <p>{displayRole}</p>
        </div>
        <div className="profile-actions">
          <button className="primary-button fit" type="button">
            <Edit3 size={15} />
            Edit Profile
          </button>
        </div>
      </section>

      <div className="profile-grid">
        <section className="profile-card panel">
          <div className="profile-card-header">
            <UserRound size={16} />
            <strong>Personal Information</strong>
          </div>
          <div className="profile-field-list">
            <ProfileField label="Full Name" value={profile.fullName} />
            <ProfileField label="Email Address" value={profile.email} />
            <ProfileField label="Phone Number" value={profile.phone} />
            {isJockey && <ProfileField label="Experience Years" value={`${profile.experienceYears || 5} (Professional)`} />}
            {isJockey && (
              <div className="profile-field">
                <span>Jockey Rating</span>
                <RatingValue value={profile.jockeyRating} />
              </div>
            )}
          </div>
        </section>

        <section className="profile-wallet panel">
          <div className="profile-card-header">
            <Wallet size={16} />
            <strong>Wallet Information</strong>
            <span>Main Balance</span>
          </div>
          <small>Current Balance</small>
          <strong>{formatCurrency(profile.balance || 0)}</strong>
          <button className="primary-button full" type="button">+ Add Funds</button>
        </section>
      </div>
    </section>
  );
}

export default ProfilePage;
