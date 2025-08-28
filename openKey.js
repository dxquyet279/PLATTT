async function openKey(key) {
  if (!s3) return alert('Not connected to S3 yet.');
  const bucket = els.bucket.value.trim();

  try {
    setStatus('Downloading…'); // instead of "Signing URL…"

    // Get the object bytes using your Cognito credentials
    const out = await s3.getObject({ Bucket: bucket, Key: key }).promise();

    // out.Body is an ArrayBuffer/Blob (browser AWS SDK v2). Wrap into a Blob:
    const blob = out.Body instanceof Blob ? out.Body : new Blob([out.Body], { type: 'application/epub+zip' });

    // Create a local object URL for ePub.js
    const blobUrl = URL.createObjectURL(blob);

    await openBook(blobUrl);
    setStatus('');
    location.hash = encodeURIComponent(key);
  } catch (err) {
    console.error(err);
    setStatus('');
    alert('Failed to fetch book: ' + (err?.message || err));
  }
}