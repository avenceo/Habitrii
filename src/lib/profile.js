// Habitrii — profile helpers (Phase 04)
import { supabase } from "./supabase";

export async function fetchProfile() {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, tier, trial_ends_at, onboarding_complete")
    .eq("id", user.id)
    .single();
  if (error) { console.warn("fetchProfile:", error.message); return null; }
  return data;
}

export async function savePersonality({ mbti, westernSign, chineseSign }) {
  if (!supabase) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from("personality").upsert({
    user_id: user.id,
    mbti_type: mbti || null,
    western_zodiac: westernSign || null,
    chinese_zodiac: chineseSign || null,
    updated_at: new Date().toISOString(),
  });
  if (error) console.warn("savePersonality:", error.message);
}

export async function completeOnboarding() {
  if (!supabase) return;
  const { error } = await supabase.rpc("complete_onboarding");
  if (error) console.warn("completeOnboarding:", error.message);
}

// Hybrid trial: 30 days of full access from signup; Mind & Money free forever.
export function trialActive(profile) {
  if (!profile?.trial_ends_at) return false;
  return new Date(profile.trial_ends_at).getTime() > Date.now();
}

export function trialDaysLeft(profile) {
  if (!profile?.trial_ends_at) return 0;
  const ms = new Date(profile.trial_ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86400000));
}
