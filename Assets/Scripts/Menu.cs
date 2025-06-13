using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Menu : MonoBehaviour
{
	/*
	 * Load first Level
	 * @memberOf : Menu
	 */
	public void play() {
		// Load Game Scene
		SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
	}


	/*
	 * Make the game quit
	 * @memberOf : Menu
	 */
	public void quit() {

		// ⚠️ For Debug
		Debug.Log("QUITTING GAME");

		// Quit application
		Application.Quit();
	}
}
