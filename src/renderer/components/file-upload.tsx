export function FileUpload() {
  return <div>
    <input type="file" id="file-upload"/>
    <label htmlFor="file-upload">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path fill="currentColor" className="attachFile"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
      </svg>
    </label>
  </div>;
}