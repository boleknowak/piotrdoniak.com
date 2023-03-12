```mermaid
erDiagram
	posts {
		Int id PK  "autoincrement()"
		String title
		String slug  "nullable"
		String full_slug  "nullable"
		String content  "nullable"
		DateTime createdAt  "now()"
		DateTime updatedAt
	}
	accounts {
		String id PK  "cuid()"
		String user_id
		String type
		String provider
		String provider_account_id
		String refresh_token  "nullable"
		String access_token  "nullable"
		Int expires_at  "nullable"
		String token_type  "nullable"
		String scope  "nullable"
		String id_token  "nullable"
		String session_state  "nullable"
		DateTime created_at  "now()"
		DateTime updated_at  "nullable"
	}
	sessions {
		String id PK  "cuid()"
		String session_token
		String user_id
		DateTime expires
		DateTime created_at  "now()"
		DateTime updated_at  "nullable"
	}
	users {
		String id PK  "cuid()"
		String name  "nullable"
		String email  "nullable"
		DateTime email_verified  "nullable"
		String image  "nullable"
		DateTime created_at  "now()"
		DateTime updated_at  "nullable"
	}
	verification_tokens {
		String identifier
		String token
		DateTime expires
	}
	accounts }o--|| users : user
	sessions }o--|| users : user

```
