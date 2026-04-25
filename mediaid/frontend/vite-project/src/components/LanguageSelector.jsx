export default function LanguageSelector({ value, onChange, className = 'topbar-lang', id }) {
  return (
    <select className={className} value={value} onChange={e => onChange(e.target.value)} id={id}>
      <option value="en">🇬🇧 English</option>
      <option value="ur">🇵🇰 اردو (Urdu)</option>
      <option value="hi">🇮🇳 हिंदी (Hindi)</option>
      <option value="ar">🇸🇦 العربية (Arabic)</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="es">🇪🇸 Español</option>
      <option value="sw">🇰🇪 Kiswahili</option>
      <option value="bn">🇧🇩 বাংলা (Bengali)</option>
    </select>
  );
}
