using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Pickup : MonoBehaviour
{

	// SFX to play when picking up the item
	[SerializeField] private AudioClip pickupSFX;

	// State
	private bool _isPickedUp = false;

	// GameSession script
	private GameSession _gameSession;

	/*
	 * Start is called before the first frame update
	 * @memberOf : UnityEngine
	 */
	void Start() {

		// Get GameSession script
		_gameSession = FindObjectOfType<GameSession>();
	}

	/*
	 * Called every frame
	 * @memberOf : UnityEngine
	 */
	void Update() {
	
	}

	/*
	 * Called when new object is colliding
	 * @memberOf : UnityEngine.Event
	 */
	void OnTriggerEnter2D(Collider2D other) {

		// If Item is already PickedUp or
		// If his is not a player stop here
		if (_isPickedUp || other.gameObject.layer != LayerMask.NameToLayer("Player")) return;


		// Set picked up status
		_isPickedUp = true;

		// Play pickyp SFX
		AudioSource.PlayClipAtPoint(pickupSFX, Camera.main.transform.position);

		// If object is a heal heal player
		if (gameObject.tag == "heal")
			_gameSession.heal();
		
		// If object is a arrow, add an arrow to the player
		else if (gameObject.tag == "arrow pickup")
			_gameSession.addArrow();

		// Else it's a coin to add score
		else
			_gameSession.addScore();

		// Destory current game object
		Destroy(gameObject);
	}
}
