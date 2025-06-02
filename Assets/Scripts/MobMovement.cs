using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MobMovement : MonoBehaviour
{

	// Components
	private Rigidbody2D _rigidbody;
	private Animator _animator;
	private SpriteRenderer _spriteRenderer;

	// Mob main collider
	private BoxCollider2D _collider;

	// Mob movement config
	[Header("Movement values")]
	[SerializeField] private float moveSpeed = 5f;

	// Collider check system
	[Header("Colliders checker System")]
	[SerializeField] private BoxCollider2D frontCollider;
	[SerializeField] private BoxCollider2D bottomCollider;

	// Start is called before the first frame update
	void Start()
	{
		// getting components ...
		_rigidbody = GetComponent<Rigidbody2D>();
		_collider = GetComponent<BoxCollider2D>();
		_animator = GetComponent<Animator>();
		_spriteRenderer = GetComponent<SpriteRenderer>();

		_rigidbody.velocity = new Vector2 (moveSpeed, 0f);
	}

	// Update is called once per frame
	void Update()
	{
		// If we dont there is void under the mob or there is a wall in front of him
		if (!checkBottomCollision() || checkFrontCollision()) {
			// Flip mob
			Vector3 scale = transform.localScale;
			scale.x *= -1;
			transform.localScale = scale;
			// change direction
			_rigidbody.velocity = new Vector2 (moveSpeed * -1, 0f);
		}
	}


	bool checkFrontCollision() {
		// Check if player is touching a ladder
		return frontCollider.IsTouchingLayers(LayerMask.GetMask("Platforms"));
	}

	bool checkBottomCollision() {
		// Check if player is touching a ladder
		return bottomCollider.IsTouchingLayers(LayerMask.GetMask("Platforms"));
	}
}
