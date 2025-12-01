#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
سكربت متكامل لـ SEO وLocal Business و Content Optimization
ريبو: arabsad-ads (مؤسسة إعلانات العرب)
دول الخليج كاملة + كل مدنها
"""

import sys
import re
import json
from pathlib import Path
from datetime import datetime, timedelta

# ================== بيانات دول الخليج كاملة ==================

GULF_COUNTRIES = {
    "SA": {
        "name": "السعودية",
        "arabic_name": "المملكة العربية السعودية",
        "lat": 24.7136,
        "lng": 46.6753,
        "cities": {
            "الرياض": {"lat": 24.7136, "lng": 46.6753},
            "جدة": {"lat": 21.5485, "lng": 39.1721},
            "الدمام": {"lat": 26.3989, "lng": 50.2048},
            "الخبر": {"lat": 26.2156, "lng": 50.2106},
            "القطيف": {"lat": 26.1801, "lng": 50.0157},
            "مكة": {"lat": 21.4225, "lng": 39.8262},
            "المدينة": {"lat": 24.4647, "lng": 39.6074},
            "الطائف": {"lat": 21.2745, "lng": 40.4158},
            "تبوك": {"lat": 28.3852, "lng": 36.5627},
            "أبها": {"lat": 18.2155, "lng": 42.5054},
            "جيزان": {"lat": 16.8892, "lng": 42.5521},
            "نجران": {"lat": 17.6927, "lng": 44.1860},
            "حفر الباطن": {"lat": 28.4347, "lng": 45.3569},
        },
    },
    "AE": {
        "name": "الإمارات",
        "arabic_name": "الإمارات العربية المتحدة",
        "lat": 23.4241,
        "lng": 53.8478,
        "cities": {
            "دبي": {"lat": 25.2048, "lng": 55.2708},
            "أبوظبي": {"lat": 24.4539, "lng": 54.3773},
            "الشارقة": {"lat": 25.3548, "lng": 55.3944},
            "عجمان": {"lat": 25.3986, "lng": 55.4501},
            "أم القيوين": {"lat": 25.5645, "lng": 55.5597},
            "رأس الخيمة": {"lat": 25.7482, "lng": 55.9754},
            "الفجيرة": {"lat": 25.1242, "lng": 56.3540},
        },
    },
    "KW": {
        "name": "الكويت",
        "arabic_name": "دولة الكويت",
        "lat": 29.3759,
        "lng": 47.9774,
        "cities": {
            "مدينة الكويت": {"lat": 29.3759, "lng": 47.9774},
            "الأحمدي": {"lat": 29.1118, "lng": 47.6929},
            "الجهراء": {"lat": 29.4444, "lng": 47.6804},
            "الفروانية": {"lat": 29.2269, "lng": 47.8558},
            "حولي": {"lat": 29.3621, "lng": 47.9825},
            "مبارك الكبير": {"lat": 29.0269, "lng": 47.7373},
            "العاصمة": {"lat": 29.3759, "lng": 47.9774},
        },
    },
    "QA": {
        "name": "قطر",
        "arabic_name": "دولة قطر",
        "lat": 25.2854,
        "lng": 51.5310,
        "cities": {
            "الدوحة": {"lat": 25.2854, "lng": 51.5310},
            "الريان": {"lat": 25.3548, "lng": 51.5342},
            "الوكرة": {"lat": 25.1673, "lng": 51.6286},
            "الخور": {"lat": 25.6753, "lng": 51.4805},
            "أم صلال": {"lat": 25.4167, "lng": 51.5000},
            "الشمال": {"lat": 25.8500, "lng": 51.2500},
        },
    },
    "BH": {
        "name": "البحرين",
        "arabic_name": "مملكة البحرين",
        "lat": 26.0667,
        "lng": 50.5577,
        "cities": {
            "المنامة": {"lat": 26.1290, "lng": 50.5826},
            "المحرق": {"lat": 26.1667, "lng": 50.5833},
            "الرفاع": {"lat": 26.1333, "lng": 50.4167},
            "الجفير": {"lat": 26.1778, "lng": 50.4389},
            "سلمان آباد": {"lat": 26.0833, "lng": 50.5000},
        },
    },
    "OM": {
        "name": "عمان",
        "arabic_name": "سلطنة عمان",
        "lat": 21.4735,
        "lng": 55.9754,
        "cities": {
            "مسقط": {"lat": 21.4735, "lng": 55.9754},
            "صلالة": {"lat": 17.0151, "lng": 54.0924},
            "صحار": {"lat": 24.2795, "lng": 56.9366},
            "نزوى": {"lat": 22.9342, "lng": 57.5364},
            "السويق": {"lat": 23.8069, "lng": 57.4074},
            "شناص": {"lat": 24.7167, "lng": 56.7833},
            "هيماء": {"lat": 24.2000, "lng": 56.6000},
        },
    },
}

# ================== الدوال الأساسية ==================

def extract_title(html: str) -> str:
    """استخراج العنوان"""
    m = re.search(r'<title[^>]*>([^<]+)</title>', html, re.IGNORECASE)
    if m:
        txt = m.group(1).strip()
        return txt.split('|')[0].strip() if '|' in txt else txt
    m = re.search(r'<h1[^>]*>([^<]+)</h1>', html, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    return "صفحة من مؤسسة إعلانات العرب"

def extract_description(html: str) -> str:
    """استخراج الوصف"""
    m = re.search(r'<meta\s+name=["\']description["\']\s+content=["\']([^"\']+)["\']', html, re.IGNORECASE)
    if m:
        return m.group(1).strip()
    m = re.search(r'<p[^>]*>([^<]+)</p>', html, re.IGNORECASE)
    if m:
        txt = m.group(1).strip()
        return txt if len(txt) <= 155 else txt[:152] + "..."
    return "خدمات تسويق رقمي متميزة من مؤسسة إعلانات العرب"

def extract_image(html: str) -> str:
    """استخراج الصورة"""
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>', html, re.IGNORECASE)
    if m:
        src = m.group(1).strip()
        if src.startswith('http'):
            return src
        src = src.lstrip('./')
        return f"https://sherow1982.github.io/arabsad-ads/{src}"
    return "https://sherow1982.github.io/arabsad-ads/assets/images/logo.svg"

def determine_page_type(file_path: Path) -> str:
    """تحديد نوع الصفحة"""
    relative = str(file_path.relative_to(Path("."))).lower()
    if 'blog/articles' in relative:
        return 'article'
    elif 'blog' in relative:
        return 'blog'
    elif 'services' in relative:
        return 'service'
    elif 'cities' in relative:
        return 'city'
    return 'page'

def build_page_url(file_path: Path) -> str:
    """بناء الرابط"""
    relative_path = file_path.relative_to(Path("."))
    url_path = str(relative_path).replace("\\", "/")
    return f"https://sherow1982.github.io/arabsad-ads/{url_path}"

def extract_page_keywords(file_path: Path, title: str) -> list:
    """استخراج keywords"""
    keywords = []
    
    # Global keywords
    keywords.extend([
        "Google Ads", "إعلانات جوجل", "Facebook Ads", "إعلانات فيسبوك",
        "SEO", "تحسين محركات البحث", "تسويق رقمي", "التسويق الرقمي",
        "تصميم المواقع", "Web Design", "Social Media Ads", "إعلانات وسائل التواصل"
    ])
    
    # Country keywords
    for country_code, country_data in GULF_COUNTRIES.items():
        keywords.append(f"تسويق رقمي {country_data['name']}")
        keywords.append(f"إعلانات جوجل {country_data['name']}")
        for city in list(country_data["cities"].keys())[:2]:
            keywords.append(f"تسويق رقمي {city}")
            keywords.append(f"Google Ads {city}")
    
    keywords.append(title)
    return list(set(keywords))[:25]

# ================== Schema ==================

def create_service_schema(title: str, image: str, url: str, description: str) -> str:
    """Service Schema"""
    import json
    
    area_served = []
    for country_code, country_data in GULF_COUNTRIES.items():
        area_served.append({"@type": "Country", "name": country_data['arabic_name']})
    
    schema = {
        "@context": "https://schema.org/",
        "@type": "Service",
        "name": title,
        "image": image,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "مؤسسة إعلانات العرب",
            "url": "https://sherow1982.github.io/arabsad-ads/",
            "logo": "https://sherow1982.github.io/arabsad-ads/assets/images/logo.svg",
            "telephone": "+201110760081"
        },
        "url": url,
        "areaServed": area_served,
        "priceRange": "$$-$$$"
    }
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_article_schema(title: str, image: str, url: str, description: str, file_path: Path) -> str:
    """Article Schema"""
    import json
    try:
        date_modified = datetime.fromtimestamp(file_path.stat().st_mtime).isoformat()
    except:
        date_modified = datetime.now().isoformat()
    
    schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "image": image,
        "description": description,
        "datePublished": date_modified,
        "dateModified": date_modified,
        "author": {"@type": "Organization", "name": "مؤسسة إعلانات العرب"},
        "publisher": {
            "@type": "Organization",
            "name": "مؤسسة إعلانات العرب",
            "logo": {"@type": "ImageObject", "url": "https://sherow1982.github.io/arabsad-ads/assets/images/logo.svg"}
        },
        "url": url
    }
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_organization_schema() -> str:
    """Organization Schema"""
    import json
    schema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "مؤسسة إعلانات العرب",
        "alternateName": "ArabSad Digital Marketing",
        "image": "https://sherow1982.github.io/arabsad-ads/assets/images/logo.svg",
        "description": "وكالة تسويق رقمي متخصصة في Google Ads وFacebook Ads وSEO وتصميم المواقع",
        "url": "https://sherow1982.github.io/arabsad-ads/",
        "telephone": "+201110760081",
        "email": "info@arabsad.com",
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "EG",
            "addressRegion": "الجيزة",
            "addressLocality": "حدائق أكتوبر"
        }
    }
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_breadcrumb_schema(file_path: Path) -> str:
    """Breadcrumb Schema"""
    import json
    relative = file_path.relative_to(Path("."))
    parts = relative.parts
    breadcrumb_items = [{"@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://sherow1982.github.io/arabsad-ads"}]
    
    current_path = ""
    for i, part in enumerate(parts[:-1], start=2):
        current_path += f"/{part}" if current_path else part
        name = part.replace('-', ' ').title()
        breadcrumb_items.append({
            "@type": "ListItem",
            "position": i,
            "name": name,
            "item": f"https://sherow1982.github.io/arabsad-ads/{current_path}"
        })
    
    schema = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": breadcrumb_items}
    return json.dumps(schema, ensure_ascii=False, indent=2)

def create_meta_tags(title: str, image: str, url: str, description: str, keywords: list) -> str:
    """Meta Tags"""
    if len(description) > 155:
        desc_short = description[:152] + "..."
    else:
        desc_short = description
    
    title_clean = title.replace('"', '').replace("'", '')
    keywords_str = ", ".join(keywords[:15])
    
    meta = f"""
    <!-- SEO Meta Tags (Auto) -->
    <meta charset="UTF-8">
    <title>{title_clean} - مؤسسة إعلانات العرب | وكالة تسويق رقمي الخليج</title>
    <meta name="description" content="{desc_short}">
    <meta name="keywords" content="{keywords_str}">
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="language" content="ar">
    <meta name="author" content="مؤسسة إعلانات العرب">
    <link rel="canonical" href="{url}">
    <!-- Open Graph -->
    <meta property="og:title" content="{title_clean} - مؤسسة إعلانات العرب">
    <meta property="og:description" content="{desc_short}">
    <meta property="og:image" content="{image}">
    <meta property="og:url" content="{url}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="ar_EG">
    """
    return meta

# ================== Google Business Profiles ==================

def create_google_business_profile_json() -> str:
    """إنشاء Google Business Profile Data JSON لكل المدن"""
    import json
    profiles = []
    
    for country_code, country_data in GULF_COUNTRIES.items():
        for city_name, city_coords in country_data["cities"].items():
            profile = {
                "business_name": f"مؤسسة إعلانات العرب - {city_name}",
                "country_code": country_code,
                "country_name": country_data['arabic_name'],
                "city": city_name,
                "phone": "+201110760081",
                "website": "https://sherow1982.github.io/arabsad-ads/",
                "latitude": city_coords['lat'],
                "longitude": city_coords['lng'],
                "services": [
                    "Google Ads", "Facebook Ads", "Instagram Ads", "SEO",
                    "تصميم المواقع", "التسويق الرقمي"
                ],
                "opening_hours": {
                    "monday": "08:00-23:00", "tuesday": "08:00-23:00",
                    "wednesday": "08:00-23:00", "thursday": "08:00-23:00",
                    "friday": "08:00-23:00", "saturday": "08:00-23:00",
                    "sunday": "08:00-23:00"
                },
                "service_areas": [city_name, country_data['name']]
            }
            profiles.append(profile)
    
    # حفظ بشكل صحيح
    json_str = json.dumps(profiles, ensure_ascii=False, indent=2)
    return json_str

def create_local_business_schemas_all() -> list:
    """LocalBusiness Schema لكل المدن"""
    import json
    schemas = []
    
    for country_code, country_data in GULF_COUNTRIES.items():
        for city_name, city_coords in country_data["cities"].items():
            schema = {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": f"مؤسسة إعلانات العرب - {city_name}",
                "image": "https://sherow1982.github.io/arabsad-ads/assets/images/logo.svg",
                "url": "https://sherow1982.github.io/arabsad-ads/",
                "telephone": "+201110760081",
                "address": {
                    "@type": "PostalAddress",
                    "addressCountry": country_code,
                    "addressLocality": city_name
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": city_coords['lat'],
                    "longitude": city_coords['lng']
                }
            }
            schemas.append(json.dumps(schema, ensure_ascii=False, indent=2))
    
    return schemas

# ================== Sitemap ==================

def generate_sitemap(all_files: list) -> str:
    """توليد Sitemap XML"""
    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for file_path in all_files:
        if file_path.name.endswith('.html'):
            url = build_page_url(file_path)
            try:
                last_mod = datetime.fromtimestamp(file_path.stat().st_mtime).strftime('%Y-%m-%d')
            except:
                last_mod = datetime.now().strftime('%Y-%m-%d')
            
            priority = "1.0" if file_path.name == 'index.html' else "0.7"
            changefreq = "daily" if file_path.name == 'index.html' else "weekly"
            
            sitemap += f"""  <url>
    <loc>{url}</loc>
    <lastmod>{last_mod}</lastmod>
    <changefreq>{changefreq}</changefreq>
    <priority>{priority}</priority>
  </url>
"""
    
    sitemap += '</urlset>'
    return sitemap

# ================== Robots.txt ==================

def generate_robots_txt() -> str:
    """توليد robots.txt"""
    return """User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

User-agent: Googlebot
Allow: /

Sitemap: https://sherow1982.github.io/arabsad-ads/sitemap.xml
Crawl-delay: 1
"""

# ================== الحقن الرئيسي ==================

def inject_seo(html: str, title: str, image: str, url: str, description: str, file_path: Path, page_type: str, keywords: list, local_business_schemas: list) -> str:
    """حقن كل شيء في <head>"""
    if '</head>' not in html:
        if '<body' in html.lower():
            html = html.replace('<body', '</head><body', 1)
        else:
            html = html + '</head>'
    
    html = re.sub(r'<script\s+type=["\']?application/ld\+json["\']?\s*>.*?</script>', '', html, flags=re.DOTALL | re.IGNORECASE)
    
    meta = create_meta_tags(title, image, url, description, keywords)
    
    if page_type == 'article':
        main_schema = create_article_schema(title, image, url, description, file_path)
    else:
        main_schema = create_service_schema(title, image, url, description)
    
    org_schema = create_organization_schema()
    breadcrumb_schema = create_breadcrumb_schema(file_path)
    
    local_business_snippets = "\n".join([f"<script type=\"application/ld+json\">\n{schema}\n</script>" for schema in local_business_schemas[:10]])
    
    injection = f"""
{meta}

<!-- Main Schema (Auto) -->
<script type="application/ld+json">
{main_schema}
</script>

<!-- Organization Schema (Auto) -->
<script type="application/ld+json">
{org_schema}
</script>

<!-- LocalBusiness Schemas - Gulf Countries (Auto) -->
{local_business_snippets}

<!-- Breadcrumb Schema (Auto) -->
<script type="application/ld+json">
{breadcrumb_schema}
</script>

</head>"""
    
    return html.replace('</head>', injection, 1)

def process_file(file_path: Path, all_files: list, local_business_schemas: list) -> tuple:
    """معالجة ملف"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            html = f.read()
        
        title = extract_title(html)
        image = extract_image(html)
        description = extract_description(html)
        url = build_page_url(file_path)
        page_type = determine_page_type(file_path)
        keywords = extract_page_keywords(file_path, title)
        
        updated = inject_seo(html, title, image, url, description, file_path, page_type, keywords, local_business_schemas)
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(updated)
        
        return (True, file_path.relative_to(Path(".")), page_type)
    except Exception as e:
        return (False, file_path.relative_to(Path(".")), str(e))

def main():
    print("\n" + "="*80)
    print("🏆 سكربت SEO شامل + Local Business كامل الخليج - arabsad-ads 🏆")
    print("="*80 + "\n")

    root = Path(".")
    
    search_paths = [
        ("root", root, "*.html"),
        ("services", root / "services", "*.html"),
        ("cities", root / "cities", "*.html"),
        ("blog", root / "blog", "*.html"),
        ("articles", root / "blog" / "articles", "*.html"),
    ]
    
    all_files = []
    for folder_name, folder_path, pattern in search_paths:
        if folder_path.exists():
            files = sorted(folder_path.glob(pattern))
            all_files.extend(files)
            if files:
                print(f"📂 {folder_name}: {len(files)} ملف")
    
    if not all_files:
        print("\n❌ لم يتم العثور على أي ملفات HTML")
        sys.exit(1)

    print(f"\n📦 إجمالي الملفات: {len(all_files)}\n")

    # إنشاء Local Business Schemas
    print("🏗️ جاري إنشاء Local Business Schemas...")
    local_business_schemas = create_local_business_schemas_all()
    print(f"   ✅ تم إنشاء {len(local_business_schemas)} Local Business Schema\n")

    ok = 0
    fail = 0

    # معالجة الملفات
    for i, fp in enumerate(all_files, 1):
        rel_path = fp.relative_to(root)
        print(f"[{i}/{len(all_files)}] {rel_path} ...", end=" ")
        
        success, filename, result = process_file(fp, all_files, local_business_schemas)
        if success:
            print(f"✅")
            ok += 1
        else:
            print(f"❌ {result}")
            fail += 1

    # إنشاء Sitemap
    print("\n📍 جاري إنشاء Sitemap XML...")
    sitemap_content = generate_sitemap(all_files)
    with open(root / "sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_content)
    print("   ✅ sitemap.xml تم إنشاؤها")

    # إنشاء robots.txt
    print("🤖 جاري إنشاء robots.txt...")
    robots_content = generate_robots_txt()
    with open(root / "robots.txt", "w", encoding="utf-8") as f:
        f.write(robots_content)
    print("   ✅ robots.txt تم إنشاؤها")

    # إنشاء Google Business Profile JSON
    print("🏪 جاري إنشاء Google Business Profile Data...")
    gbp_content = create_google_business_profile_json()
    gbp_file_path = root / "google-business-profiles.json"
    
    with open(gbp_file_path, "w", encoding="utf-8") as f:
        f.write(gbp_content)
    
    # التحقق من عدد الملفات
    gbp_count = gbp_content.count('"business_name"')
    print(f"   ✅ google-business-profiles.json تم إنشاؤها ({gbp_count} ملف تعريف)\n")
    
    # النتائج النهائية
    print("="*80)
    print("📊 النتائج النهائية:")
    print("="*80)
    print(f"✅ ملفات محدثة: {ok}")
    print(f"❌ ملفات فشلت: {fail}")
    print(f"📈 نسبة النجاح: {(ok/len(all_files)*100):.1f}%")

    print("\n📁 الملفات المُنشأة:")
    print("   ✅ sitemap.xml")
    print("   ✅ robots.txt")
    print(f"   ✅ google-business-profiles.json ({gbp_count} ملف تعريف)")

    print("\n🌐 دول الخليج المُدعومة:")
    total_cities = 0
    for code, country in GULF_COUNTRIES.items():
        city_count = len(country["cities"])
        total_cities += city_count
        print(f"   ✅ {country['name']} ({code}): {city_count} مدينة")
    
    print(f"\n   💰 إجمالي: {total_cities} مدينة في {len(GULF_COUNTRIES)} دول")
    print(f"   💰 إجمالي Google Business Profiles: {gbp_count}")

    print("\n" + "="*80 + "\n")

if __name__ == "__main__":
    main()
