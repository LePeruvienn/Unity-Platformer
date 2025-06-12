using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MobMovement : MonoBehaviour
{

	// GameSession script
	private GameSession _gameSession;

	// Components
	private Rigidbody2D _rigidbody;
	private Animator _animator;
	private SpriteRenderer _spriteRenderer;

	// Mob main collider
	private BoxCollider2D _collider;
	private CapsuleCollider2D _bottomCollider;

	// Current Mob direction
	private Vector2 _currentDirection;

	// Mob states
	private bool _isDead = false;

	// Mob movement config
	[Header("Movement values")]
	[SerializeField] private float moveSpeed = 5f;

	[Header("Die Animation")]
	[SerializeField] private float deathJumpForce = 6f;
	[SerializeField] private float deathRotateSpeed = 2f;

	// Cached vars ☝️🤓 "Used to optimize memory allocation !"
	private Vector3 _cachedDeathRotation = new Vector3 (0, 0, 0);

	/*
	 * Start Method used to get Mob's Components & set _rigidbody velocity
	 * @memberOf : UnityEngine
	 */
	void Start() {
		// getting components ...
		_rigidbody = GetComponent<Rigidbody2D>();
		_collider = GetComponent<BoxCollider2D>();
		_bottomCollider = GetComponent<CapsuleCollider2D>();
		_animator = GetComponent<Animator>();
		_spriteRenderer = GetComponent<SpriteRenderer>();

		// Set current direction
		_currentDirection = new Vector2(moveSpeed, 0);
		_rigidbody.velocity = _currentDirection;

		// Get gme session script
		_gameSession = FindObjectOfType<GameSession>();
	}

	/*
	 * Is called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {

		// If mob is alive do nothing
		if (!_isDead) return;

		// Return if player is not falling
		if (_rigidbody.velocity.y > 0) return;

		// Make player rotate over time
		_cachedDeathRotation.z = deathRotateSpeed * Time.deltaTime * 1000;
		transform.Rotate (_cachedDeathRotation);
	}

	void OnTriggerEnter2D(Collider2D other) {

		// Dont do anything if mob is dead
		if (_isDead) return;

		// If collision is not in the layer Player return
		if (other.gameObject.layer != LayerMask.NameToLayer("Player"))
			return;

		// KILL PLAYER !!!!! 😠🖕
		_gameSession.takeLife();
	}

	/*
	 * Is called when a collider is leaving an element
	 * @memberOf : UnityEngine.Event
	 */
	void OnTriggerExit2D(Collider2D other) {

		// Dont do anything if mob is dead
		if (_isDead) return;

		// If object is a Platform
		if (other.gameObject.layer == LayerMask.NameToLayer("Platforms")) {

			// Set mob's new direction
			_currentDirection.x *= -1;

			// Set mob's new velocity
			_rigidbody.velocity = _currentDirection;

			// Flip mob 
			Vector2 scale = transform.localScale;
			scale.x *= -1;
			transform.localScale = scale;
		}
	}

	/*
	 * Kill the Mob
	 * @memberOf : UnityEngine.Event
	 */
	public void kill() {

		// Set Mob state
		_isDead = true;

		// Stop Animator
		_animator.speed = 0f;

		// Set RigidbodyType to Dynamic
		_rigidbody.bodyType = RigidbodyType2D.Dynamic;

		// Add velocity to top !
		_rigidbody.velocity = new Vector2 (0, deathJumpForce);
	}
}
