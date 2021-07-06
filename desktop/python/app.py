from tkinter import Tk, PhotoImage, Label, Entry, Button, messagebox, filedialog, END, CENTER
from playsound import playsound


def init(metrics_data: dict):
    top_window = Tk()

    # main widget properties
    top_window.geometry(f'{metrics_data["width"]}x{metrics_data["height"]}')
    top_window.iconphoto(False, PhotoImage(file=f'../{metrics_data["icon"]}'))
    top_window.configure(bg=metrics_data['background'])
    top_window.title(metrics_data['title'])

    # TODO: set $HOME directory as default (may be in config)
    path_save = None

    def play(track_path: str, duration: int) -> None:
        playsound(track_path, False)
        top_window.after(duration * 1000, lambda: play(track_path, duration))

    def pick_directory():
        path_save = filedialog.askdirectory().strip()

        print('directory to save:', path_save)

        if path_save:
            input_directory.delete(0, END)
            input_directory.insert(0, path_save)

    def make_request():
        author: str = input_author.get().strip()

        print('author:', author)

        if not author.strip():
            messagebox.showerror('🚫 Error occurred!', 'Empty string is not allowed as author\'s name.')

            return 1

        # directory to save should be present -- chosen or default

        pass

    def close():
        top_window.destroy()
        top_window.quit()

    # UI
    label_guide = Label(top_window, text=metrics_data['guide'], font=('Arial Bold', 23))
    label_guide.grid(column=0, row=0, padx=(14, 5), pady=(20, 50))

    input_author = Entry(top_window, width=50)
    input_author.grid(column=0, row=8)
    input_author.focus()

    input_directory = Entry(top_window, width=50)
    input_directory.grid(column=0, row=9)

    button_choose = Button(top_window, text='Choose', command=pick_directory)
    button_choose.grid(column=0, row=9)

    button_go = Button(top_window, text='Go!', command=make_request)
    button_go.grid(column=0, row=10)

    top_window.protocol('WM_DELETE_WINDOW', close)
    play(f'../{metrics_data["track"]}', 83)

    top_window.mainloop()
