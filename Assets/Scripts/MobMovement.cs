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
	private CapsuleCollider2D _bottomCollider;

	// Current Mob direction
	private Vector2 _currentDirection;

	// Mob movement config
	[Header("Movement values")]
	[SerializeField] private float moveSpeed = 5f;

	/*
	 * Start Method used to get Mob's Components & set _rigidbody velocity
	 * @memberOf : UnityEngine
	 */
	void Start()
	{
		// getting components ...
		_rigidbody = GetComponent<Rigidbody2D>();
		_collider = GetComponent<BoxCollider2D>();
		_bottomCollider = GetComponent<CapsuleCollider2D>();
		_animator = GetComponent<Animator>();
		_spriteRenderer = GetComponent<SpriteRenderer>();

		_currentDirection = new Vector2(moveSpeed, 0);
		_rigidbody.velocity = _currentDirection;
	}

	/*
	 * Is called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {

	}

	void OnTriggerEnter2D(Collider2D other) {

		// If collision is not in the layer Player return
		if (other.gameObject.layer != LayerMask.NameToLayer("Player"))
			return;

		// Get Player Movement component
		PlayerMovement player = other.GetComponent<PlayerMovement>();

		// If we object dont have a PlayerMovement compoenent return
		if (player == null)
			return;

		// KILL PLAYER !!!!! 😠🖕
		player.kill();
	}

	/*
	 * Is called when a collider is leaving an element
	 * @memberOf : UnityEngine.Event
	 */
	void OnTriggerExit2D(Collider2D other) {

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
}
