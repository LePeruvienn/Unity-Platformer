using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Menu : MonoBehaviour
{
	public void play() {
		// Load Game Scene
		SceneManager.LoadScene(SceneManager.GetActiveScene().buildIndex + 1);
	}

	public void quit() {

		// ⚠️ For Debug
		Debug.Log("QUITTING GAME");

		// Quit application
		Application.Quit();
	}
}
