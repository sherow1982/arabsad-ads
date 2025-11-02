/**
 * TinyMCE عربي لموقع إعلانات العرب
 * محرر متقدم للمحتوى والإعلانات
 */

// تحميل TinyMCE
function loadTinyMCE() {
  if (window.tinymce) return Promise.resolve();
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tinymce@7/tinymce.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// إعداد محرر إعلانات العرب
function initArabsadEditor() {
  const config = {
    selector: '.arabsad-editor, textarea.rich-editor',
    
    plugins: [
      'autolink', 'autoresize', 'autosave', 'charmap', 'code',
      'codesample', 'directionality', 'emoticons', 'fullscreen',
      'image', 'insertdatetime', 'link', 'lists', 'media', 'preview',
      'quickbars', 'save', 'searchreplace', 'table', 'visualblocks',
      'wordcount'
    ].join(' '),
    
    toolbar: [
      'undo redo | styles | bold italic underline | fontfamily fontsize',
      'forecolor backcolor | alignleft aligncenter alignright alignjustify | ltr rtl',
      'bullist numlist | outdent indent | link image media table emoticons',
      'code preview fullscreen | searchreplace | help'
    ].join(' | '),
    
    menubar: 'file edit view insert format tools table help',
    
    // إعدادات عربية
    directionality: 'rtl',
    language: 'ar',
    
    height: 500,
    min_height: 300,
    max_height: 800,
    resize: 'vertical',
    
    branding: false,
    promotion: false,
    
    // حفظ تلقائي
    autosave_ask_before_unload: true,
    autosave_interval: '30s',
    autosave_retention: '2m',
    
    content_style: `
      body {
        font-family: 'Cairo', 'Amiri', Arial, sans-serif;
        font-size: 15px;
        line-height: 1.7;
        direction: rtl;
        text-align: right;
        color: #2c3e50;
        background: #fff;
      }
      h1, h2, h3, h4, h5, h6 {
        font-weight: bold;
        color: #34495e;
        margin: 1.2em 0 0.6em 0;
      }
      .ad-highlight {
        background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
        padding: 3px 6px;
        border-radius: 4px;
        font-weight: bold;
      }
      .arabsad-quote {
        background: #f8f9fa;
        border-right: 4px solid #17a2b8;
        padding: 20px;
        margin: 20px 0;
        border-radius: 6px;
        font-style: italic;
      }
      .success-box {
        background: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
        padding: 15px;
        border-radius: 6px;
        margin: 15px 0;
      }
    `,
    
    style_formats: [
      {
        title: 'أنماط إعلانات العرب',
        items: [
          { title: 'نص إعلاني مميز', inline: 'span', classes: 'ad-highlight' },
          { title: 'اقتباس عربي', block: 'blockquote', classes: 'arabsad-quote' },
          { title: 'مربع نجاح', block: 'div', classes: 'success-box' },
          { title: 'عنوان إعلان', block: 'h2', styles: { color: '#e74c3c', 'text-align': 'center' } }
        ]
      }
    ],
    
    setup: function(editor) {
      // زر حفظ إعلان
      editor.ui.registry.addButton('saveAd', {
        text: '💾 حفظ إعلان',
        tooltip: 'حفظ محتوى الإعلان',
        onAction: function() {
          const content = editor.getContent();
          const title = document.title || 'إعلان-عربي';
          
          const fullHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Cairo', Arial, sans-serif;
            direction: rtl;
            text-align: right;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.7;
        }
        h1, h2, h3 { color: #2c3e50; }
        .ad-highlight {
            background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
            padding: 3px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    ${content}
    <hr style="margin-top: 40px;">
    <p style="text-align: center; color: #7f8c8d; font-size: 12px;">
        تم إنشاؤه بواسطة موقع إعلانات العرب - https://arabsad.com
    </p>
</body>
</html>`;
          
          const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `arabsad-ad-${Date.now()}.html`;
          link.click();
          URL.revokeObjectURL(url);
          
          editor.notificationManager.open({
            text: 'تم حفظ الإعلان بنجاح! 🎉',
            type: 'success',
            timeout: 3000
          });
        }
      });
      
      // زر معاينة مباشرة
      editor.ui.registry.addButton('previewAd', {
        text: '👁️ معاينة',
        tooltip: 'معاينة الإعلان',
        onAction: function() {
          const content = editor.getContent();
          const previewWindow = window.open('', '_blank');
          previewWindow.document.write(`
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>معاينة الإعلان</title>
    <style>
        body {
            font-family: 'Cairo', Arial, sans-serif;
            direction: rtl;
            text-align: right;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.7;
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        h1, h2, h3 { color: #2c3e50; }
        .ad-highlight {
            background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
            padding: 3px 6px;
            border-radius: 4px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>👁️ معاينة الإعلان</h1>
        ${content}
    </div>
</body>
</html>
          `);
          previewWindow.document.close();
        }
      });
      
      // إضافة الأزرار لشريط الأدوات
      editor.on('init', function() {
        const toolbar = editor.theme.panel.find('toolbar');
        if (toolbar && toolbar.length > 0) {
          toolbar[0].append('saveAd previewAd');
        }
      });
    }
  };
  
  tinymce.init(config);
}

// تهيئة تلقائية
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadTinyMCE().then(initArabsadEditor).catch(console.error);
  });
} else {
  loadTinyMCE().then(initArabsadEditor).catch(console.error);
}

// تصدير
window.ArabsadEditor = { loadTinyMCE, initArabsadEditor };