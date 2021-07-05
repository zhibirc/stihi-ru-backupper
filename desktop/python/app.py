from tkinter import Tk, Label, Entry, Button
from playsound import playsound


def init(metrics_data: dict):
    top_window = Tk()

    top_window.geometry(f'{metrics_data["width"]}x{metrics_data["height"]}')
    top_window.configure(bg=metrics_data['background'])
    top_window.title(metrics_data['title'])

    def play(track_path):
        playsound(track_path, False)

    def pick_directory():
        pass

    def make_request():
        author: str = input_author.get()

        if author.strip() == '':
            raise Exception('empty string is not allowed as author\'s name')

        pass

    def close():
        top_window.destroy()
        top_window.quit()

    # UI
    label_guide = Label(top_window, text=metrics_data['guide'])
    label_guide.grid(column=0, row=5)

    input_author = Entry(top_window, width=10)
    input_author.grid(column=0, row=8)

    button_choose = Button(top_window, text='Choose', command=pick_directory)
    button_choose.grid(column=1, row=8)

    button_go = Button(top_window, text='Go!', command=make_request)
    button_go.grid(column=1, row=9)

    # label_guide.pack()
    # input_author.pack()
    # button_choose.pack()

    top_window.protocol('WM_DELETE_WINDOW', close)
    play(metrics_data["track"])

    top_window.mainloop()
