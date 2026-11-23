// Khmer text constants to avoid SWC parsing issues with Unicode in JSX
export const UniversityTexts = {
  // Header
  backToPathfinder: 'ត្រឡប់ទៅ PATHFINDER',

  // Hero section
  universityDirectory: 'ការវាយតម្លៃសាកលវិទ្យាល័យ',
  findUniversities: 'រកសាកលវិទ្យាល័យតាមជំនាញ',
  findUniversitiesDesc: 'ស្វែងរកសាកលវិទ្យាល័យនៅកម្ពុជាដែលផ្តល់ជំនាញដែលអ្នកចង់សិក្សា ជាមួយព័ត៌មានលម្អិតអំពីថ្លៃសិក្សា តម្រូវការចូលរៀន និងអាហារូបករណ៍',

  // Search & Filter
  selectMajor: 'ជ្រើសរើសជំនាញដើម្បីមើលសាកលវិទ្យាល័យ',
  clearSelection: 'សម្អាត',

  // Results section
  foundUniversities: 'រកឃើញ',
  universitiesInCambodia: 'សាកលវិទ្យាល័យនៅកម្ពុជា',
  universitiesFor: 'សាកលវិទ្យាល័យសម្រាប់',
  close: 'បិទ',

  // Top 3 / Filter status
  top3Recommended: '★ កំពូលសាកលវិទ្យាល័យទាំង ៣ ដែលណែនាំបំផុត (Top 3 Recommended)',
  selectedUniversities: 'សាកលវិទ្យាល័យដែលបានជ្រើសរើស',
  top3Description: 'ជ្រើសរើសដោយផ្អែកលើកិត្យានុភាព គុណភាពបណ្តុះបណ្តាល និងឱកាសការងារជាក់ស្តែង',
  provinceSelectedDescription: 'បង្ហាញស្ថាប័នក្នុងខេត្តដែលបានជ្រើសរើស (ជ្រើសរើស «គ្រប់ ២៥ ខេត្ត/រាជធានី» ដើម្បីមើលកំពូលទាំង ៣ ថ្នាក់ជាតិ)',
  allProvincesDescription: 'សាកលវិទ្យាល័យដែលផ្តល់ជូនជំនាញនេះនៅទូទាំងប្រទេសកម្ពុជា',

  // Empty state
  noUniversitiesInProvince: 'មិនមានសាកលវិទ្យាល័យក្នុងខេត្តនេះនៅឡើយទេ',
  noUniversitiesInProvinceHint: 'សូមជ្រើសរើស «គ្រប់ ២៥ ខេត្ត/រាជធានី» ដើម្បីស្វែងរកសាកលវិទ្យាល័យនៅទូទាំងប្រទេស។',

  // View all toggle
  collapseToTop3: 'បង្រួមមកកំពូល ៣ សាកលវិទ្យាល័យ',
  viewAllByProvince: 'មើលសាកលវិទ្យាល័យទាំងអស់តាមបណ្តាខេត្ត',

  // Back to top 3
  backToTop3: 'ត្រឡប់ទៅមើលកំពូលទាំង ៣ ទូទាំងប្រទេស',

  // Browse majors empty state
  selectMajorToStart: 'ជ្រើសរើសជំនាញដើម្បីចាប់ផ្តើម',
  selectMajorDesc: 'ជ្រើសរើសជំនាញមួយពីក្រុមទាំង ២០ ដើម្បីមើលសាកលវិទ្យាល័យដែលផ្តល់ជូនជំនាញនេះ',

  // Major cards
  schools: 'សាលា',
  noData: 'គ្មានទិន្នន័យ',
  viewUniversities: 'មើលសាកលវិទ្យាល័យ',
  noSchoolsAvailable: 'មិនមានសាលានៅឡើយ',
} as const;

export type UniversityTextKey = keyof typeof UniversityTexts;