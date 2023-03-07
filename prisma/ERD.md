```mermaid
erDiagram
	Post {
		Int id PK  "autoincrement()"
		String title
		String content  "nullable"
		DateTime createdAt  "now()"
		DateTime updatedAt
	}

```
