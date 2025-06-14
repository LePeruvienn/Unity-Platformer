using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Arrow : MonoBehaviour
{
	// GameSession script
	private GameSession _gameSession;

	// Components
	private Rigidbody2D _rigidbody;
	private PolygonCollider2D _collider;
	private SpriteRenderer _spriteRenderer;

	// Arrow state
	private bool _onGround = false;

	/*
	 * Start Method used to get Mob's Components & set _rigidbody velocity
	 * @memberOf : UnityEngine
	 */
	void Start() {

		// Get GameSession
		_gameSession = FindObjectOfType<GameSession>();

		// getting components ...
		_rigidbody = GetComponent<Rigidbody2D>();
		_collider = GetComponent<PolygonCollider2D>();
		_spriteRenderer = GetComponent<SpriteRenderer>();
	}

	/*
	 * Is called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {

	}

	void OnTriggerEnter2D(Collider2D other) {

		// If item is on ground and player touch it
		if (_onGround && other.gameObject.layer == LayerMask.NameToLayer("Player")) {

			// reset _onGround
			_onGround = false;

			// Make player pickup the arrow
			_gameSession.addArrow();

			// Destroy game object
			Destroy(gameObject);
		}
		// If collide with a Mob 
		else if (!_onGround && other.gameObject.layer == LayerMask.NameToLayer("Entities")) {

			// Get mob Monvement component
			MobMovement mob = other.gameObject.GetComponent<MobMovement>();

			// KILL MOB 😠🖕
			if (mob != null)
				mob.kill();

			// Destroy Arrow
			Destroy(gameObject);
		}

		// If collide with Platforms
		else if (other.gameObject.layer == LayerMask.NameToLayer("Platforms")) {

			// Make the arrow stop
			_rigidbody.velocity = new Vector2(0, 0);

			// Set _onGround status to true !
			_onGround = true;
		}
	}
}
