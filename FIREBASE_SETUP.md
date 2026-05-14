# Firebase Setup Instructions

## Firebase Storage Rules

Paste this in Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Firebase Firestore Rules

Paste this in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Steps

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. For Storage rules: Storage → Rules → Edit → Paste above → Publish
4. For Firestore rules: Firestore Database → Rules → Edit → Paste above → Publish
