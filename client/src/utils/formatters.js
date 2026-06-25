export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  export const capitalize = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  };
  
  export const formatReadTime = (wordCount) => {
    const wpm = 200;
    const minutes = Math.ceil(wordCount / wpm);
    return `${minutes} min read`;
  };