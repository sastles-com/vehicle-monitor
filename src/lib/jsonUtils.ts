export async function loadJsonFile(path: string) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading JSON file from ${path}:`, error);
    return null;
  }
}

export async function saveJsonFile(data: any, filename: string) {
  try {
    const response = await fetch('/api/save-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename,
        data
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save JSON file');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving JSON file:', error);
    return null;
  }
}