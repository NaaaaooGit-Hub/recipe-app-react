import React, { useState } from 'react';

function App() {
  const [recipes, setRecipes] = useState(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [lang, setLang] = useState('ja');
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [url, setUrl] = useState('');
  const [analyzeImage, setAnalyzeImage] = useState(null);
  const [cardImage, setCardImage] = useState(null);
  const [cardImagePreview, setCardImagePreview] = useState(null);
  const [aiStatus, setAiStatus] = useState('');

  const handleCardImageChange = (e) => {
    const file = e.target.files[0];
    setCardImage(file);
    if (file) {
      setCardImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAnalyze = async () => {
    if (!analyzeImage) return;
    setAiStatus(lang === 'ja' ? '解析中...' : 'Analyzing...');
    try {
      const formData = new FormData();
      formData.append('image', analyzeImage);
      const res = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setAiStatus(`Error: ${data.error}`);
        return;
      }
      setName(data.recipe.name || '');
      setIngredients(data.recipe.ingredients || '');
      setSteps(data.recipe.steps || '');
      setAiStatus(lang === 'ja' ? '反映しました！' : 'Done!');
    } catch (e) {
      setAiStatus(`Error: ${e.message}`);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setName(''); setIngredients(''); setSteps(''); setUrl('');
    setAnalyzeImage(null); setCardImage(null); setCardImagePreview(null); setAiStatus('');
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'recipe_upload');
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/ditak4ztk/image/upload`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    return data.secure_url;
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter(r => r.id !== id));
  };

  const startEdit = (r) => {
    setEditId(r.id);
    setName(r.name);
    setIngredients(r.ingredients);
    setSteps(r.steps);
    setUrl(r.url || '');
    setShowModal(true);
  };

  const addRecipe = async () => {
    if (!name) return;
    let imageUrl = cardImagePreview;
    if (cardImage) {
      imageUrl = await uploadToCloudinary(cardImage);
    }
    if (editId) {
      setRecipes(recipes.map(r =>
        r.id === editId
          ? { ...r, name, ingredients, steps, url, cardImagePreview: imageUrl }
          : r
      ));
      setEditId(null);
    } else {
      setRecipes([...recipes, { id: Date.now(), name, ingredients, steps, url, cardImagePreview: imageUrl }]);
    }
    setName(''); setIngredients(''); setSteps(''); setUrl('');
    setAnalyzeImage(null); setCardImage(null); setCardImagePreview(null); setAiStatus('');
    setShowModal(false);
  };

  React.useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const t = {
    title: lang === 'ja' ? '🍳 Recipe Box' : '🍳 Recipe Box',
    addNew: lang === 'ja' ? '＋ 新規レシピ' : '＋ New Recipe',
    empty: lang === 'ja' ? 'まだレシピがありません。' : 'No recipes yet.',
    emptyHint: lang === 'ja' ? '＋ 新規レシピから追加してみましょう！' : 'Add your first recipe!',
    ingredients: lang === 'ja' ? '材料：' : 'Ingredients:',
    steps: lang === 'ja' ? '作り方：' : 'Steps:',
    siteLink: lang === 'ja' ? 'レシピサイトを見る ↗' : 'View Recipe Site ↗',
    modalTitle: lang === 'ja' ? '新規レシピ' : 'New Recipe',
    aiSection: lang === 'ja' ? '🤖 AIでレシピを解析' : '🤖 Analyze with AI',
    aiButton: lang === 'ja' ? 'AIで解析' : 'Analyze',
    cardImage: lang === 'ja' ? '📷 カード用画像' : '📷 Card Image',
    recipeName: lang === 'ja' ? 'レシピ名' : 'Recipe Name',
    ingredientsLabel: lang === 'ja' ? '材料' : 'Ingredients',
    stepsLabel: lang === 'ja' ? '作り方' : 'Steps',
    urlLabel: lang === 'ja' ? 'レシピサイトURL' : 'Recipe Site URL',
    saveButton: lang === 'ja' ? 'レシピを追加' : 'Save Recipe',
    cancelButton: lang === 'ja' ? 'キャンセル' : 'Cancel',
    confirmDelete: lang === 'ja' ? 'このレシピを削除しますか？' : 'Delete this recipe?',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6f0', fontFamily: "'Helvetica Neue', sans-serif" }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #eee', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#333' }}>{t.title}</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn-primary"
            onClick={() => setShowModal(true)}
            style={{ borderRadius: 24, padding: '10px 20px', fontSize: 14, fontWeight: 600 }}
          >
            {t.addNew}
          </button>
          <button
            className="btn-secondary"
            onClick={() => setLang(lang === 'ja' ? 'en' : 'ja')}
            style={{ borderRadius: 24, padding: '10px 20px', fontSize: 14, fontWeight: 600 }}
          >
            {lang === 'ja' ? 'EN' : 'JA'}
          </button>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        {recipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#bbb' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
            <p style={{ fontSize: 16, margin: 0, lineHeight: 1.8 }}>
              {t.empty}<br />{t.emptyHint}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {recipes.map(r => (
              <div key={r.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
                {r.cardImagePreview
                  ? <img src={r.cardImagePreview} alt={r.name} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: 200, background: '#f5f0eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>🍽️</div>
                }
                <div style={{ padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h2 style={{ margin: 0, fontSize: 18, color: '#333' }}>{r.name}</h2>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button className="btn-delete" onClick={() => startEdit(r)}>🖊️</button>
                      <button className="btn-delete" onClick={() => {
                        if (window.confirm(t.confirmDelete)) deleteRecipe(r.id);
                      }}>🗑️</button>
                    </div>
                  </div>
                  <div style={{ margin: '0 0 6px', fontSize: 13, color: '#666' }}>
                    <b>{t.ingredients}</b>
                    {r.ingredients.split('\n').map((item, i) => (
                      <div key={i}>• {item}</div>
                    ))}
                  </div>
                  <div style={{ margin: '0 0 10px', fontSize: 13, color: '#666' }}>
                    <b>{t.steps}</b>
                    {r.steps.split('\n').map((item, i) => (
                      <div key={i}>{item}</div>
                    ))}
                  </div>
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#e07b54', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                      {t.siteLink}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 420, maxHeight: '85vh', overflowY: 'auto' }}>
            <h2 style={{ margin: '0 0 16px', color: '#333' }}>{t.modalTitle}</h2>

            <div style={{ background: '#fdf6f0', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <p style={{ margin: '0 0 10px', fontWeight: 600, color: '#333' }}>{t.aiSection}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="file" accept="image/*" onChange={e => setAnalyzeImage(e.target.files[0])} style={{ flex: 1, fontSize: 13 }} />
                <button className="btn-primary" onClick={handleAnalyze} style={{ borderRadius: 8, padding: '8px 14px', fontSize: 13 }}>
                  {t.aiButton}
                </button>
              </div>
              {aiStatus && <p style={{ margin: '8px 0 0', fontSize: 13, color: aiStatus.includes('Error') || aiStatus.includes('エラー') ? 'red' : 'green' }}>{aiStatus}</p>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{t.cardImage}</label>
              {cardImagePreview && (
                <img src={cardImagePreview} alt="preview" style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
              )}
              <input type="file" accept="image/*" onChange={handleCardImageChange} style={{ fontSize: 13 }} />
            </div>

            {[
              { label: t.recipeName, value: name, setter: setName, type: 'input' },
              { label: t.ingredientsLabel, value: ingredients, setter: setIngredients, type: 'textarea' },
              { label: t.stepsLabel, value: steps, setter: setSteps, type: 'textarea' },
              { label: t.urlLabel, value: url, setter: setUrl, type: 'input' },
            ].map(({ label, value, setter, type }) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>{label}</label>
                {type === 'input'
                  ? <input value={value} onChange={e => setter(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
                  : <textarea value={value} onChange={e => setter(e.target.value)} rows={3} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
                }
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button className="btn-primary" onClick={addRecipe} style={{ flex: 1, borderRadius: 8, padding: '10px', fontSize: 14, fontWeight: 600 }}>
                {t.saveButton}
              </button>
              <button className="btn-secondary" onClick={handleCancel} style={{ flex: 1, borderRadius: 8, padding: '10px', fontSize: 14 }}>
                {t.cancelButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;