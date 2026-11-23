const fs = require('fs');
const data = JSON.parse(fs.readFileSync('universities.json', 'utf8'));

console.log(`Checking ${data.universities.length} universities...`);

const provinces = new Set();
data.universities.forEach(u => {
  if (u.province) provinces.add(u.province);
});

console.log(`Unique provinces found: ${provinces.size}/25`);
console.log(Array.from(provinces).sort());

const majorsSrc = fs.readFileSync('data/majors.ts', 'utf8');
const nameEnglishMatches = [...majorsSrc.matchAll(/nameEnglish:\s*'([^']+)'/g)].map(m => m[1]);

function majorNameToKey(nameEnglish) {
  return nameEnglish.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

let failed = false;
for (const name of nameEnglishMatches) {
  const key = majorNameToKey(name);
  const exact = [];
  const related = [];
  for (const university of data.universities) {
    for (const faculty of university.faculties || []) {
      for (const m of faculty.majors || []) {
        if (m.key === key) {
          exact.push(university.short_name || university.name_en);
        } else if (m.related_majors && m.related_majors.includes(key)) {
          related.push(university.short_name || university.name_en);
        }
      }
    }
  }
  console.log(`Major: ${key.padEnd(36)} -> ${exact.length} exact matches (${exact.slice(0, 3).join(', ')})`);
  if (exact.length < 3) {
    console.error(`ERROR: ${key} has only ${exact.length} exact matches! Needs >= 3.`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log('SUCCESS: ALL 20 MAJORS HAVE AT LEAST 3 EXACT MATCHING UNIVERSITIES!');
}
