const params = JFCustomWidget.getWidgetParameter('openaiApiKey');
// subscribe when ready
JFCustomWidget.subscribe('ready', function() {
  // resize if needed
  JFCustomWidget.sendData({ valid: true, value: '' });
});

document.getElementById('generate').addEventListener('click', async () => {
  const notes = document.getElementById('notes').value;
  if (!notes.trim()) {
    alert('Please enter notes');
    return;
  }
  document.getElementById('report').value = 'Generating…';
  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + params
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a professional surveillance report writer.' },
          { role: 'user', content: 'Turn these rough notes into a polished professional surveillance report:\n' + notes }
        ],
        temperature: 0.7
      })
    });
    const data = await resp.json();
    if (data && data.choices && data.choices[0].message && data.choices[0].message.content) {
      const report = data.choices[0].message.content.trim();
      document.getElementById('report').value = report;
      JFCustomWidget.sendData({ valid: true, value: report });
    } else {
      throw new Error('Invalid OpenAI response');
    }
  } catch (err) {
    console.error(err);
    alert('Error generating report: ' + err.message);
    document.getElementById('report').value = '';
    JFCustomWidget.sendData({ valid: false, value: '' });
  }
});
